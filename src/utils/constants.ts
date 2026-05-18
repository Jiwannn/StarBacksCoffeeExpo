export const TAX_RATE = 0.12;
export const DELIVERY_FEE = 50;
export const FREE_DELIVERY_THRESHOLD = 500;

export const PRODUCT_CATEGORIES = {
  hot: { id: 'hot', name: 'Hot Coffees', icon: '☕', color: '#00704A' },
  cold: { id: 'cold', name: 'Cold Coffees', icon: '🧊', color: '#1E3932' },
  frappe: { id: 'frappe', name: 'Frappuccino', icon: '🥤', color: '#4A7C59' },
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

export const SIZES = [
  { id: 'small', label: 'Small (S)', price: 0 },
  { id: 'medium', label: 'Medium (M)', price: 20 },
  { id: 'large', label: 'Large (L)', price: 40 },
];

export const SUGAR_LEVELS = [
  { id: '0', label: '0% Sugar' },
  { id: '25', label: '25% Sugar' },
  { id: '50', label: '50% Sugar' },
  { id: '75', label: '75% Sugar' },
  { id: '100', label: '100% Sugar' },
];

export const MILK_OPTIONS = [
  { id: 'regular', label: 'Regular Milk', extraPrice: 0 },
  { id: 'oat', label: 'Oat Milk', extraPrice: 15 },
  { id: 'almond', label: 'Almond Milk', extraPrice: 15 },
  { id: 'soy', label: 'Soy Milk', extraPrice: 15 },
];

export const ADD_ONS = [
  { id: 'extra_shot', name: 'Extra Shot', price: 30 },
  { id: 'whipped_cream', name: 'Whipped Cream', price: 20 },
  { id: 'vanilla_syrup', name: 'Vanilla Syrup', price: 20 },
  { id: 'caramel_syrup', name: 'Caramel Syrup', price: 20 },
  { id: 'hazelnut_syrup', name: 'Hazelnut Syrup', price: 20 },
];