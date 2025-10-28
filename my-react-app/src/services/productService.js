import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { calculateTotalQuantity } from '../utils/helpers';
import { deleteMultipleImages, extractImagePath } from './storageService';

const PRODUCTS_COLLECTION = 'products';

// إضافة منتج جديد
export const addProduct = async (productData) => {
  try {
    const totalQuantity = calculateTotalQuantity(productData.sizes);
    
    const newProduct = {
      ...productData,
      totalQuantity,
      salePrice: productData.salePrice || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), newProduct);
    
    return {
      success: true,
      id: docRef.id,
      message: 'تم إضافة المنتج بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في إضافة المنتج:', error);
    throw new Error('فشل إضافة المنتج');
  }
};

// تحديث منتج
export const updateProduct = async (productId, productData) => {
  try {
    const totalQuantity = calculateTotalQuantity(productData.sizes);
    
    const updatedProduct = {
      ...productData,
      totalQuantity,
      updatedAt: serverTimestamp()
    };
    
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, updatedProduct);
    
    return {
      success: true,
      message: 'تم تحديث المنتج بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في تحديث المنتج:', error);
    throw new Error('فشل تحديث المنتج');
  }
};

// حذف منتج
export const deleteProduct = async (productId) => {
  try {
    // الحصول على بيانات المنتج لحذف الصور
    const product = await getProductById(productId);
    
    if (product && product.images && product.images.length > 0) {
      // استخراج مسارات الصور وحذفها
      const imagePaths = product.images
        .map(url => extractImagePath(url))
        .filter(path => path !== null);
      
      if (imagePaths.length > 0) {
        await deleteMultipleImages(imagePaths);
      }
    }
    
    // حذف المنتج من Firestore
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
    
    return {
      success: true,
      message: 'تم حذف المنتج بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في حذف المنتج:', error);
    throw new Error('فشل حذف المنتج');
  }
};

// الحصول على منتج واحد
export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error('المنتج غير موجود');
    }
    
    return {
      id: productSnap.id,
      ...productSnap.data()
    };
    
  } catch (error) {
    console.error('خطأ في جلب المنتج:', error);
    throw error;
  }
};

// الحصول على جميع المنتجات
export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
    
  } catch (error) {
    console.error('خطأ في جلب المنتجات:', error);
    throw new Error('فشل جلب المنتجات');
  }
};

// الحصول على منتجات حسب الفئة
export const getProductsByCategory = async (category) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
    
  } catch (error) {
    console.error('خطأ في جلب منتجات الفئة:', error);
    throw new Error('فشل جلب المنتجات');
  }
};

// إنشاء تخفيض على منتج
export const createSale = async (productId, salePrice) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      salePrice: parseFloat(salePrice),
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      message: 'تم إضافة التخفيض بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في إضافة التخفيض:', error);
    throw new Error('فشل إضافة التخفيض');
  }
};

// إلغاء التخفيض
export const removeSale = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      salePrice: null,
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      message: 'تم إلغاء التخفيض بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في إلغاء التخفيض:', error);
    throw new Error('فشل إلغاء التخفيض');
  }
};

// تحديث كمية منتج
export const updateProductQuantity = async (productId, sizes) => {
  try {
    const totalQuantity = calculateTotalQuantity(sizes);
    
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      sizes,
      totalQuantity,
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      message: 'تم تحديث الكمية بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في تحديث الكمية:', error);
    throw new Error('فشل تحديث الكمية');
  }
};