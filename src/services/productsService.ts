import { db } from '@/firebase/app';
import { Order, OrderStatus, Product, ReservedSize } from '@/types/models';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

/**
 * Fetch all available products with optional filters
 */
export async function getAvailableProducts(filters?: {
  ownerAdminId?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
}): Promise<Product[]> {
  let q: any = query(collection(db, PRODUCTS_COLLECTION));

  // Build query constraints
  const constraints = [];

  if (filters?.ownerAdminId) {
    constraints.push(where('ownerAdminId', '==', filters.ownerAdminId));
  }

  if (constraints.length > 0) {
    q = query(collection(db, PRODUCTS_COLLECTION), ...constraints);
  }

  const snapshot = await getDocs(q);
  const products = snapshot.docs.map((d) => d.data() as Product);

  // Filter by price range in memory (Firestore doesn't support compound range queries easily)
  let filtered = products;
  if (filters?.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }

  // Filter by size in memory
  if (filters?.size) {
    filtered = filtered.filter((p) => p.sizes.includes(filters.size!));
  }

  return filtered;
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Product) : null;
}

/**
 * Reserve a product size and create initial order (transactional)
 * Ensures status is "available" and size is not already reserved
 */
export async function reserveProductAndCreateOrder(
  productId: string,
  buyerUserId: string,
  selectedSize: string
): Promise<string> {
  // Fetch current product state
  const product = await getProductById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  if (product.status !== 'available') {
    throw new Error(`Product is ${product.status}, cannot reserve`);
  }

  if (!product.sizes.includes(selectedSize)) {
    throw new Error(`Size ${selectedSize} not available for this product`);
  }

  const isSizeReserved = product.reservedSizes?.some((rs) => rs.size === selectedSize);
  if (isSizeReserved) {
    throw new Error(`Size ${selectedSize} is already reserved`);
  }

  // Create batch transaction
  const batch = writeBatch(db);

  // Update product: add size to reservedSizes and update status if all sizes reserved
  const productRef = doc(db, PRODUCTS_COLLECTION, productId);
  const newReservedSize: ReservedSize = {
    size: selectedSize,
    reservedBy: buyerUserId,
    reservedAt: Date.now(),
  };

  const reservedSizes = [...(product.reservedSizes || []), newReservedSize];

  batch.update(productRef, {
    reservedSizes,
    status: 'reserved' as const,
    updatedAt: serverTimestamp(),
  });

  // Create initial order (pending)
  const orderRef = doc(collection(db, ORDERS_COLLECTION));
  const initialOrder: Omit<Order, 'id'> = {
    productId,
    buyerUserId,
    selectedSize,
    shippingAddress: {} as any, // Will be filled in checkout
    paymentStatus: 'pending',
    orderStatus: 'pending' as OrderStatus,
    createdAt: Date.now(),
  };

  batch.set(orderRef, initialOrder);

  // Commit transaction
  await batch.commit();

  return orderRef.id;
}

/**
 * Get all orders for a buyer
 */
export async function getBuyerOrders(buyerUserId: string): Promise<Order[]> {
  const q = query(collection(db, ORDERS_COLLECTION), where('buyerUserId', '==', buyerUserId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Order));
}

/**
 * Get all orders for a seller (by product owner)
 */
export async function getSellerOrders(ownerAdminId: string): Promise<Order[]> {
  const q = query(collection(db, PRODUCTS_COLLECTION), where('ownerAdminId', '==', ownerAdminId));
  const snapshot = await getDocs(q);
  const productIds = snapshot.docs.map((d) => d.id);

  const orders: Order[] = [];
  for (const productId of productIds) {
    const orderQuery = query(
      collection(db, ORDERS_COLLECTION),
      where('productId', '==', productId)
    );
    const orderSnapshot = await getDocs(orderQuery);
    orders.push(...orderSnapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Order)));
  }

  return orders;
}

/**
 * Update order with shipping address and mark ready for payment
 */
export async function updateOrderWithShipping(
  orderId: string,
  shippingAddress: any
): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(orderRef, {
    shippingAddress,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Mark order as paid and product as sold (called by webhook from Firebase Functions after Stripe confirmation)
 */
export async function confirmOrderPayment(orderId: string, paymentIntentId: string): Promise<void> {
  const order = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
  if (!order.exists()) {
    throw new Error('Order not found');
  }

  const orderData = order.data() as Order;
  const product = await getProductById(orderData.productId);

  if (!product) {
    throw new Error('Product not found');
  }

  const batch = writeBatch(db);

  // Update order status
  batch.update(doc(db, ORDERS_COLLECTION, orderId), {
    paymentStatus: 'paid',
    orderStatus: 'processing' as const,
    paymentIntentId,
    updatedAt: serverTimestamp(),
  });

  // Mark product as sold
  batch.update(doc(db, PRODUCTS_COLLECTION, orderData.productId), {
    status: 'sold' as const,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

/**
 * Create a product (admin only)
 */
export async function createProduct(
  ownerAdminId: string,
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'ownerAdminId'>
): Promise<string> {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...productData,
    ownerAdminId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update a product (admin only)
 */
export async function updateProduct(
  productId: string,
  ownerAdminId: string,
  updates: Partial<Product>
): Promise<void> {
  const product = await getProductById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  if (product.ownerAdminId !== ownerAdminId) {
    throw new Error('Unauthorized: only owner can update product');
  }

  const productRef = doc(db, PRODUCTS_COLLECTION, productId);
  await updateDoc(productRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a product (admin only)
 */
export async function deleteProduct(productId: string, ownerAdminId: string): Promise<void> {
  const product = await getProductById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  if (product.ownerAdminId !== ownerAdminId) {
    throw new Error('Unauthorized: only owner can delete product');
  }

  await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
}

/**
 * Get all products by a seller
 */
export async function getSellerProducts(ownerAdminId: string): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS_COLLECTION), where('ownerAdminId', '==', ownerAdminId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Product));
}
