import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { Order, CartItem, Address } from '../types';

export const orderService = {
  async createOrder(
    userId: string,
    items: CartItem[],
    subtotal: number,
    tax: number,
    deliveryFee: number,
    total: number,
    paymentMethod: 'gcash' | 'cod',
    shippingAddress: Address
  ): Promise<string> {
    const orderNumber = `SB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const order: Omit<Order, 'id'> = {
      userId,
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: 'pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      shippingAddress,
      orderNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await addDoc(collection(db, 'orders'), order);
    return docRef.id;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  },

  async getAllOrders(): Promise<Order[]> {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: new Date() });
  },

  async updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): Promise<void> {
    await updateDoc(doc(db, 'orders', orderId), { paymentStatus, updatedAt: new Date() });
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const docSnap = await getDoc(doc(db, 'orders', orderId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  },

  async deleteOrder(orderId: string): Promise<void> {
    await deleteDoc(doc(db, 'orders', orderId));
  }
};