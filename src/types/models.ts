export type Admin = {
  id: string; // UID
  email: string;
  displayName?: string;
  createdAt: number; // timestamp ms
};

export type ProductStatus = 'available' | 'sold' | 'archived';

export type Product = {
  id: string;
  title: string;
  description?: string;
  price: number; // cents
  sizes: string[]; // e.g., ['S','M','L']
  photos: string[]; // storage download URLs
  ownerAdminId: string; // Admin UID
  status: ProductStatus;
  createdAt: number; // timestamp ms
  updatedAt?: number; // timestamp ms
};

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
  shippingAddress: ShippingAddress;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  createdAt: number;
  updatedAt?: number;
};

export type UserProfile = {
  id: string; // UID
  email: string;
  displayName?: string;
  phone?: string;
  createdAt: number;
};
