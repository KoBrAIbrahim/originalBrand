import { STORAGE_KEYS } from './constants';

// حفظ بيانات في LocalStorage
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// قراءة بيانات من LocalStorage
export const getFromLocalStorage = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

// حذف بيانات من LocalStorage
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// مسح كل البيانات
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// إدارة السلة
export const getCart = () => {
  return getFromLocalStorage(STORAGE_KEYS.CART) || [];
};

export const saveCart = (cart) => {
  return saveToLocalStorage(STORAGE_KEYS.CART, cart);
};

export const clearCart = () => {
  return removeFromLocalStorage(STORAGE_KEYS.CART);
};

// إدارة المصادقة
export const getAuthData = () => {
  return getFromLocalStorage(STORAGE_KEYS.AUTH);
};

export const saveAuthData = (authData) => {
  return saveToLocalStorage(STORAGE_KEYS.AUTH, authData);
};

export const clearAuthData = () => {
  return removeFromLocalStorage(STORAGE_KEYS.AUTH);
};