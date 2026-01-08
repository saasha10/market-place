export type Admin = {
  id: string; // UID
  email: string;
  displayName?: string;
  createdAt: number; // timestamp ms
};

export type ProductStatus = 'available' | 'reserved' | 'sold' | 'archived';

export type ReservedSize = {
  size: string;
  reservedBy: string; // buyerUserId
  reservedAt: number;
};

export type Product = {
  id: string;
  title: string;
  description?: string;
  price: number; // cents
  sizes: string[]; // e.g., ['S','M','L']
  reservedSizes?: ReservedSize[]; // sizes currently reserved
  photos: string[]; // storage download URLs
  ownerAdminId: string; // Admin UID
  status: ProductStatus;
  condition?: string; // e.g., 'new', 'like-new', 'good', 'fair'
  createdAt: number; // timestamp ms
  updatedAt?: number; // timestamp ms
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type ShippingAddress = {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type Order = {
  id: string;
  productId: string;
  buyerUserId: string;
  selectedSize: string; // size selected for reservation
  shippingAddress: ShippingAddress;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus; // pending/processing/shipped/delivered/cancelled
  paymentIntentId?: string;
  createdAt: number;
  updatedAt?: number;
};

export type UserProfile = {
  id: string; // UID
  email: string;
  displayName?: string;
  phone?: string;
  savedAddresses?: ShippingAddress[];
  isAdmin?: boolean; // flag if user can sell
  createdAt: number;
};
