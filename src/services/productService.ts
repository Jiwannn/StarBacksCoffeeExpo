import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '../types';

export const productService = {
  // Public – only available products, optionally filtered by category
  async getProducts(category?: string): Promise<Product[]> {
    try {
      console.log('🔍 Fetching products for category:', category);
      const constraints = [where('isAvailable', '==', true)];
      if (category) {
        constraints.push(where('category', '==', category));
      }
      const q = query(collection(db, 'products'), ...constraints);
      const snapshot = await getDocs(q);
      console.log('✅ Products found:', snapshot.docs.length);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  // Admin – all products (including unavailable)
  async getAllProductsForAdmin(): Promise<Product[]> {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  },

  async getProductById(productId: string): Promise<Product | null> {
    try {
      const docSnap = await getDoc(doc(db, 'products', productId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  },

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Add product error:', error);
      throw error;
    }
  },

  async updateProduct(productId: string, data: Partial<Product>): Promise<void> {
    try {
      await updateDoc(doc(db, 'products', productId), {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },

  // Image upload disabled – use external URLs
  async uploadProductImage(imageUri: string, productId: string): Promise<string> {
    throw new Error('Image upload is not supported. Please use external image URLs.');
  },
};