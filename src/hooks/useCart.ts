import { useCart } from '../context/CartContext';

export const useCartHook = () => {
  const {
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
  } = useCart();

  return {
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
    isEmpty: cartItems.length === 0,
    itemCount: getCartCount(),
    subtotal: getSubtotal(),
    tax: getTax(),
    deliveryFee: getDeliveryFee(),
    grandTotal: getGrandTotal(),
  };
};