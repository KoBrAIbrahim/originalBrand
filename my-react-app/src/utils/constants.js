// الألوان المستخدمة في التطبيق
export const COLORS = {
  primary: '#245C3B',
  secondary: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  border: '#E0E0E0',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  background: '#F5F5F5'
};

// الفئات المتاحة
export const CATEGORIES = [
  'أحذية',
  'بلايز',
  'بناطيل',
  'رياضي',
  'جاكيت'
];

// المقاسات حسب الفئة
export const SIZES = {
  'بلايز': ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  'أحذية': ['38', '39', '40', '41', '42', '43', '44', '45'],
  'بناطيل': ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  'رياضي': ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  'جاكيت': ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
};

// الألوان المتاحة للمنتجات
export const PRODUCT_COLORS = [
  'أسود',
  'أبيض',
  'رمادي',
  'أزرق',
  'أحمر',
  'أخضر',
  'أصفر',
  'برتقالي',
  'بني',
  'بيج',
  'زهري',
  'بنفسجي'
];

// حالات الطلب
export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};

// رسائل الحالات
export const ORDER_STATUS_LABELS = {
  pending: 'قيد المراجعة',
  accepted: 'مقبول',
  rejected: 'مرفوض'
};

// مفاتيح LocalStorage
export const STORAGE_KEYS = {
  CART: 'orignal_brand_cart',
  AUTH: 'orignal_brand_auth'
};