import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Review } from '../types';

export const reviewService = {
  async addReview(data: Omit<Review, 'id' | 'createdAt'>): Promise<void> {
    await addDoc(collection(db, 'reviews'), {
      ...data,
      createdAt: new Date(),
    });
  },

  async getProductReviews(productId: string): Promise<Review[]> {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Review));
  },

  async getUserReviews(userId: string): Promise<Review[]> {
    const q = query(collection(db, 'reviews'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Review));
  },

  async hasUserReviewedProduct(userId: string, productId: string, orderId: string): Promise<boolean> {
    const q = query(
      collection(db, 'reviews'),
      where('userId', '==', userId),
      where('productId', '==', productId),
      where('orderId', '==', orderId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  },
};
