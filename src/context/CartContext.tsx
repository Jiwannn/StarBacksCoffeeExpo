import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { CartItem, Product } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getDeliveryFee: () => number;
  getGrandTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const TAX_RATE = 0.12;
const DELIVERY_FEE = 50;
const FREE_DELIVERY_THRESHOLD = 500;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart whenever user logs in or out
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    if (user) {
      const merged = await cartService.syncCartAfterLogin(user.id);
      setCartItems(merged);
    } else {
      const localCart = await cartService.getLocalCart();
      setCartItems(localCart);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    const userId = user?.id || null;
    const newCart = await cartService.addToCart(userId, product, quantity);
    setCartItems(newCart);
  };

  const removeFromCart = async (productId: string) => {
    const userId = user?.id || null;
    const newCart = await cartService.removeFromCart(userId, productId);
    setCartItems(newCart);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const userId = user?.id || null;
    const newCart = await cartService.updateQuantity(userId, productId, quantity);
    setCartItems(newCart);
  };

  const clearCart = async () => {
    const userId = user?.id || null;
    await cartService.clearCart(userId);
    setCartItems([]);
  };

  const getCartCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const getSubtotal = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getTax = () => getSubtotal() * TAX_RATE;
  const getDeliveryFee = () => getSubtotal() >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const getGrandTotal = () => getSubtotal() + getTax() + getDeliveryFee();

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getSubtotal,
        getTax,
        getDeliveryFee,
        getGrandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};