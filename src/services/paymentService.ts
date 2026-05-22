import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Payment } from '../types';

export const paymentService = {
  async createPayment(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'payments'), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  async getPaymentByOrderId(orderId: string): Promise<Payment | null> {
    const q = query(collection(db, 'payments'), where('orderId', '==', orderId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() } as Payment;
  },

  async updatePaymentStatus(paymentId: string, status: Payment['status']): Promise<void> {
    await updateDoc(doc(db, 'payments', paymentId), { status, updatedAt: new Date() });
  },

  async getUserPayments(userId: string): Promise<Payment[]> {
    const q = query(collection(db, 'payments'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Payment));
  },
};
