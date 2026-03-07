// Base URLs for each microservice
export const API_BASE = {
  AUTH:     'http://localhost:3000/api/auth',
  PRODUCT:  'http://localhost:3001/api/products',
  CART:     'http://localhost:3002/api/cart',
  ORDER:    'http://localhost:3003/api/orders',
  PAYMENT:  'http://localhost:3004/api/payment',
  AI_BUDDY: 'http://localhost:3005',
  NOTIFICATION: 'http://localhost:3006',
  SELLER:   'http://localhost:3007/api/seller',
};

export const PRODUCT_CATEGORIES = [
  { id: 'electronics', label: 'Electronics', icon: '💻' },
  { id: 'fashion',     label: 'Fashion',     icon: '👗' },
  { id: 'home',        label: 'Home & Living', icon: '🏠' },
  { id: 'beauty',      label: 'Beauty',      icon: '✨' },
  { id: 'sports',      label: 'Sports',      icon: '⚽' },
  { id: 'books',       label: 'Books',       icon: '📚' },
  { id: 'toys',        label: 'Toys & Games', icon: '🎮' },
  { id: 'grocery',     label: 'Grocery',     icon: '🛒' },
];

export const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc',   label: 'Name: A → Z' },
];
