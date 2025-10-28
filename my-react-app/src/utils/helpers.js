// تنسيق السعر
export const formatPrice = (price) => {
  return new Intl.NumberFormat('ar-PS', {
    style: 'currency',
    currency: 'ILS'
  }).format(price);
};

// تنسيق التاريخ
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  
  return new Intl.DateTimeFormat('ar-PS', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// حساب إجمالي الكمية من المقاسات
export const calculateTotalQuantity = (sizes) => {
  if (!sizes || typeof sizes !== 'object') return 0;
  
  return Object.values(sizes).reduce((total, quantity) => {
    return total + (parseInt(quantity) || 0);
  }, 0);
};

// حساب إجمالي سعر السلة
export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    const price = item.salePrice || item.sellPrice;
    return total + (price * item.quantity);
  }, 0);
};

// التحقق من توفر المقاس
export const isSizeAvailable = (product, size) => {
  if (!product.sizes || !product.sizes[size]) return false;
  return product.sizes[size] > 0;
};

// الحصول على المقاسات المتوفرة
export const getAvailableSizes = (product) => {
  if (!product.sizes) return [];
  
  return Object.entries(product.sizes)
    .filter(([, quantity]) => quantity > 0)
    .map(([size]) => size);
};

// توليد ID فريد
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// التحقق من صلاحية البريد الإلكتروني
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// التحقق من صلاحية رقم الواتساب
export const isValidWhatsApp = (phone) => {
  // Accept various common formats for Palestinian WhatsApp numbers:
  // Examples accepted: "059XXXXXXX", "+97059XXXXXXX", "0097059XXXXXXX", "059 XXXXXXX"
  if (!phone) return false;
  // strip all non-digit characters
  let digits = phone.replace(/\D/g, '');
  // remove international prefix 00
  if (digits.startsWith('00')) digits = digits.slice(2);
  // remove country code 970 if present
  if (digits.startsWith('970')) digits = digits.slice(3);
  // remove leading zero if present (local format uses a leading 0)
  if (digits.startsWith('0')) digits = digits.slice(1);
  // now expect numbers starting with 59 and 7 more digits (total 9 digits)
  return /^59\d{7}$/.test(digits);
};

// تصغير حجم الصورة قبل الرفع
export const compressImage = async (file, maxWidth = 800) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          }));
        }, 'image/jpeg', 0.8);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// فلترة الطلبات حسب التاريخ
export const filterOrdersByDate = (orders, filterType) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return orders.filter(order => {
    const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
    const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
    
    switch (filterType) {
      case 'today':
        return orderDay.getTime() === today.getTime();
      
      case 'week':
        { const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDay >= weekAgo; }
      
      case 'month':
        return orderDate.getMonth() === now.getMonth() && 
               orderDate.getFullYear() === now.getFullYear();
      
      case 'all':
      default:
        return true;
    }
  });
};

// البحث في المنتجات
export const searchProducts = (products, searchTerm) => {
  if (!searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  );
};