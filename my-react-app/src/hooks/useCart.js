import { useState, useEffect } from 'react';
import { getCart, saveCart, clearCart as clearCartStorage } from '../utils/localStorage';
import { calculateCartTotal } from '../utils/helpers';

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // تحميل السلة من LocalStorage عند البداية
  useEffect(() => {
    try {
      const savedCart = getCart();
      setCart(savedCart);
    } catch (error) {
      console.error('خطأ في تحميل السلة:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // حفظ السلة في LocalStorage عند أي تغيير
  useEffect(() => {
    if (!loading) {
      saveCart(cart);
    }
  }, [cart, loading]);

  // إضافة منتج للسلة
  const addToCart = (product, size, color, quantity = 1) => {
    setCart(prevCart => {
      // التحقق إذا كان المنتج موجود بنفس المقاس واللون
      const existingItemIndex = prevCart.findIndex(
        item => 
          item.productId === product.id && 
          item.size === size && 
          item.color === color
      );

      if (existingItemIndex > -1) {
        // تحديث الكمية إذا كان موجود
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // إضافة منتج جديد
        const newItem = {
          productId: product.id,
          productName: product.name,
          size,
          color,
          quantity,
          sellPrice: product.sellPrice,
          salePrice: product.salePrice,
          image: product.images && product.images.length > 0 ? product.images[0] : null
        };
        return [...prevCart, newItem];
      }
    });
  };

  // تحديث كمية منتج في السلة
  const updateQuantity = (productId, size, color, quantity) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (
          item.productId === productId && 
          item.size === size && 
          item.color === color
        ) {
          return { ...item, quantity: Math.max(1, quantity) };
        }
        return item;
      });
    });
  };

  // حذف منتج من السلة
  const removeFromCart = (productId, size, color) => {
    setCart(prevCart => {
      return prevCart.filter(
        item => !(
          item.productId === productId && 
          item.size === size && 
          item.color === color
        )
      );
    });
  };

  // مسح السلة بالكامل
  const clearCart = () => {
    setCart([]);
    clearCartStorage();
  };

  // حساب العدد الإجمالي للمنتجات
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // حساب السعر الإجمالي
  const getTotalPrice = () => {
    return calculateCartTotal(cart);
  };

  // التحقق إذا كان المنتج موجود في السلة
  const isInCart = (productId, size, color) => {
    return cart.some(
      item => 
        item.productId === productId && 
        item.size === size && 
        item.color === color
    );
  };

  // الحصول على كمية منتج معين في السلة
  const getItemQuantity = (productId, size, color) => {
    const item = cart.find(
      item => 
        item.productId === productId && 
        item.size === size && 
        item.color === color
    );
    return item ? item.quantity : 0;
  };

  return {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity,
    isEmpty: cart.length === 0
  };
};