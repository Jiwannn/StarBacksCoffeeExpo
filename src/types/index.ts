export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  photoURL?: string;
  phone?: string;
  address?: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  province: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: 'hot' | 'cold' | 'frappe';
  stock: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
}

export interface Customization {
  size: string;
  sizePrice: number;
  sugar: string;
  milk: string;
  milkPrice: number;
  addOns: AddOnItem[];
  specialInstructions: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  customization?: Customization;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentMethod: 'gcash' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: Address;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system';
  isRead: boolean;
  createdAt: Date;
}