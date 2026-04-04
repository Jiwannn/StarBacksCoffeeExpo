export const TAX_RATE = 0.12;
export const DELIVERY_FEE = 50;
export const FREE_DELIVERY_THRESHOLD = 500;

export const PRODUCT_CATEGORIES = {
  hot: { id: 'hot', name: 'Hot Coffees', icon: '☕', color: '#FF6600' },
  cold: { id: 'cold', name: 'Cold Coffees', icon: '🧊', color: '#4A90E2' },
  frappe: { id: 'frappe', name: 'Frappuccino', icon: '🥤', color: '#8B4513' },
} as const;

export const ORDER_STATUS = {
  pending: { label: 'Pending', color: '#FFC107' },
  confirmed: { label: 'Confirmed', color: '#2196F3' },
  preparing: { label: 'Preparing', color: '#FF9800' },
  out_for_delivery: { label: 'Out for Delivery', color: '#9C27B0' },
  delivered: { label: 'Delivered', color: '#4CAF50' },
  cancelled: { label: 'Cancelled', color: '#F44336' },
} as const;

export const PAYMENT_METHODS = {
  gcash: { label: 'GCash', icon: '📱' },
  cod: { label: 'Cash on Delivery', icon: '💵' },
} as const;

export const GCASH_DETAILS = {
  accountName: 'Jarnel Jay Alngog',
  accountNumber: '0912 345 6789',
} as const;