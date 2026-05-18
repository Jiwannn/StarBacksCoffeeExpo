import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { CartItem, Product, Customization } from '../types';

const CART_KEY = 'cart';

export const cartService = {
  async getLocalCart(): Promise<CartItem[]> {
    const cartJson = await AsyncStorage.getItem(CART_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
  },

  async saveLocalCart(cart: CartItem[]): Promise<void> {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  async getUserCart(userId: string): Promise<CartItem[]> {
    const docRef = doc(db, 'carts', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().items : [];
  },

  async saveUserCart(userId: string, items: CartItem[]): Promise<void> {
    const docRef = doc(db, 'carts', userId);
    await setDoc(docRef, { items, updatedAt: new Date() }, { merge: true });
  },

  async syncCartAfterLogin(userId: string): Promise<CartItem[]> {
    const localCart = await this.getLocalCart();
    const firestoreCart = await this.getUserCart(userId);
    const merged = [...firestoreCart];
    for (const localItem of localCart) {
      const existingIndex = merged.findIndex(
        i => i.cartItemId === localItem.cartItemId
      );
      if (existingIndex !== -1) {
        merged[existingIndex].quantity += localItem.quantity;
      } else {
        merged.push(localItem);
      }
    }
    await this.saveUserCart(userId, merged);
    await this.saveLocalCart([]);
    return merged;
  },

  async addToCart(
    userId: string | null,
    product: Product,
    quantity: number = 1,
    customPrice?: number,
    customization?: Customization
  ): Promise<CartItem[]> {
    const price = customPrice || product.price;
    // Customized items get unique ID, non-customized merge by productId
    const cartItemId = customization
      ? `${product.id}_${Date.now()}`
      : product.id;

    if (userId) {
      const cart = await this.getUserCart(userId);
      if (!customization) {
        const existingIndex = cart.findIndex(item => item.cartItemId === product.id);
        if (existingIndex !== -1) {
          cart[existingIndex].quantity += quantity;
          await this.saveUserCart(userId, cart);
          return cart;
        }
      }
      cart.push({ cartItemId, productId: product.id, name: product.name, price, quantity, imageUrl: product.imageUrl, customization });
      await this.saveUserCart(userId, cart);
      return cart;
    } else {
      const cart = await this.getLocalCart();
      if (!customization) {
        const existingIndex = cart.findIndex(item => item.cartItemId === product.id);
        if (existingIndex !== -1) {
          cart[existingIndex].quantity += quantity;
          await this.saveLocalCart(cart);
          return cart;
        }
      }
      cart.push({ cartItemId, productId: product.id, name: product.name, price, quantity, imageUrl: product.imageUrl, customization });
      await this.saveLocalCart(cart);
      return cart;
    }
  },

  async removeFromCart(userId: string | null, cartItemId: string): Promise<CartItem[]> {
    if (userId) {
      const cart = await this.getUserCart(userId);
      const newCart = cart.filter(item => item.cartItemId !== cartItemId);
      await this.saveUserCart(userId, newCart);
      return newCart;
    } else {
      const cart = await this.getLocalCart();
      const newCart = cart.filter(item => item.cartItemId !== cartItemId);
      await this.saveLocalCart(newCart);
      return newCart;
    }
  },

  async updateQuantity(userId: string | null, cartItemId: string, quantity: number): Promise<CartItem[]> {
    if (quantity <= 0) return this.removeFromCart(userId, cartItemId);
    if (userId) {
      const cart = await this.getUserCart(userId);
      const index = cart.findIndex(item => item.cartItemId === cartItemId);
      if (index !== -1) {
        cart[index].quantity = quantity;
        await this.saveUserCart(userId, cart);
      }
      return cart;
    } else {
      const cart = await this.getLocalCart();
      const index = cart.findIndex(item => item.cartItemId === cartItemId);
      if (index !== -1) {
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