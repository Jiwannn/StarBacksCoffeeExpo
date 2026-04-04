import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { CartItem, Product } from '../types';

const CART_KEY = 'cart';

export const cartService = {
  // ----- Local storage (fallback when not logged in) -----
  async getLocalCart(): Promise<CartItem[]> {
    const cartJson = await AsyncStorage.getItem(CART_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
  },

  async saveLocalCart(cart: CartItem[]): Promise<void> {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  // ----- Firestore storage (for logged‑in users) -----
  async getUserCart(userId: string): Promise<CartItem[]> {
    const docRef = doc(db, 'carts', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().items : [];
  },

  async saveUserCart(userId: string, items: CartItem[]): Promise<void> {
    const docRef = doc(db, 'carts', userId);
    await setDoc(docRef, { items, updatedAt: new Date() }, { merge: true });
  },

  // ----- Merge local cart into Firestore after login -----
  async syncCartAfterLogin(userId: string): Promise<CartItem[]> {
    const localCart = await this.getLocalCart();
    const firestoreCart = await this.getUserCart(userId);
    // Merge: keep Firestore items, add any new local items
    const merged = [...firestoreCart];
    for (const localItem of localCart) {
      const existingIndex = merged.findIndex(i => i.productId === localItem.productId);
      if (existingIndex !== -1) {
        merged[existingIndex].quantity += localItem.quantity;
      } else {
        merged.push(localItem);
      }
    }
    await this.saveUserCart(userId, merged);
    await this.saveLocalCart([]); // clear local after sync
    return merged;
  },

  // ----- Core cart operations (handles both logged‑in and guest) -----
  async addToCart(userId: string | null, product: Product, quantity: number = 1): Promise<CartItem[]> {
    if (userId) {
      const cart = await this.getUserCart(userId);
      const existingIndex = cart.findIndex(item => item.productId === product.id);
      if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl,
        });
      }
      await this.saveUserCart(userId, cart);
      return cart;
    } else {
      const cart = await this.getLocalCart();
      const existingIndex = cart.findIndex(item => item.productId === product.id);
      if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl,
        });
      }
      await this.saveLocalCart(cart);
      return cart;
    }
  },

  async removeFromCart(userId: string | null, productId: string): Promise<CartItem[]> {
    if (userId) {
      const cart = await this.getUserCart(userId);
      const newCart = cart.filter(item => item.productId !== productId);
      await this.saveUserCart(userId, newCart);
      return newCart;
    } else {
      const cart = await this.getLocalCart();
      const newCart = cart.filter(item => item.productId !== productId);
      await this.saveLocalCart(newCart);
      return newCart;
    }
  },

  async updateQuantity(userId: string | null, productId: string, quantity: number): Promise<CartItem[]> {
    if (userId) {
      const cart = await this.getUserCart(userId);
      const index = cart.findIndex(item => item.productId === productId);
      if (index !== -1) {
        if (quantity <= 0) {
          return await this.removeFromCart(userId, productId);
        }
        cart[index].quantity = quantity;
        await this.saveUserCart(userId, cart);
      }
      return cart;
    } else {
      const cart = await this.getLocalCart();
      const index = cart.findIndex(item => item.productId === productId);
      if (index !== -1) {
        if (quantity <= 0) {
          return await this.removeFromCart(null, productId);
        }
        cart[index].quantity = quantity;
        await this.saveLocalCart(cart);
      }
      return cart;
    }
  },

  async clearCart(userId: string | null): Promise<void> {
    if (userId) {
      await this.saveUserCart(userId, []);
    } else {
      await this.saveLocalCart([]);
    }
  },
};