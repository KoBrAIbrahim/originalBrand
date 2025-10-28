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
import { ORDER_STATUS } from '../utils/constants';
import { updateProductQuantity, getProductById } from './productService';

const ORDERS_COLLECTION = 'orders';

// إنشاء طلب جديد
export const createOrder = async (orderData) => {
  try {
    // التحقق من توفر الكميات قبل إنشاء الطلب
    for (const item of orderData.items) {
      const product = await getProductById(item.productId);
      
      if (!product.sizes[item.size] || product.sizes[item.size] < item.quantity) {
        throw new Error(`الكمية المطلوبة من ${product.name} (مقاس ${item.size}) غير متوفرة`);
      }
    }
    
    const newOrder = {
      ...orderData,
      status: ORDER_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder);
    
    return {
      success: true,
      orderId: docRef.id,
      message: 'تم إنشاء الطلب بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    throw error;
  }
};

// تحديث حالة الطلب
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      throw new Error('الطلب غير موجود');
    }
    
    const orderData = orderSnap.data();
    
    // إذا تم قبول الطلب، نقوم بتحديث كميات المنتجات
    if (status === ORDER_STATUS.ACCEPTED && orderData.status === ORDER_STATUS.PENDING) {
      for (const item of orderData.items) {
        const product = await getProductById(item.productId);
        const newSizes = { ...product.sizes };
        newSizes[item.size] = (newSizes[item.size] || 0) - item.quantity;
        
        if (newSizes[item.size] < 0) {
          throw new Error(`الكمية المطلوبة من ${product.name} (مقاس ${item.size}) غير متوفرة`);
        }
        
        await updateProductQuantity(item.productId, newSizes);
      }
    }
    
    // إذا تم رفض الطلب بعد القبول، نعيد الكميات
    if (status === ORDER_STATUS.REJECTED && orderData.status === ORDER_STATUS.ACCEPTED) {
      for (const item of orderData.items) {
        const product = await getProductById(item.productId);
        const newSizes = { ...product.sizes };
        newSizes[item.size] = (newSizes[item.size] || 0) + item.quantity;
        
        await updateProductQuantity(item.productId, newSizes);
      }
    }
    
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في تحديث حالة الطلب:', error);
    throw error;
  }
};

// الحصول على طلب واحد
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      throw new Error('الطلب غير موجود');
    }
    
    return {
      id: orderSnap.id,
      ...orderSnap.data()
    };
    
  } catch (error) {
    console.error('خطأ في جلب الطلب:', error);
    throw error;
  }
};

// الحصول على جميع الطلبات
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
    
  } catch (error) {
    console.error('خطأ في جلب الطلبات:', error);
    throw new Error('فشل جلب الطلبات');
  }
};

// الحصول على الطلبات حسب الحالة
export const getOrdersByStatus = async (status) => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef, 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
    
  } catch (error) {
    console.error('خطأ في جلب الطلبات:', error);
    throw new Error('فشل جلب الطلبات');
  }
};

// حذف طلب
export const deleteOrder = async (orderId) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      throw new Error('الطلب غير موجود');
    }
    
    const orderData = orderSnap.data();
    
    // إذا كان الطلب مقبولاً، نعيد الكميات قبل الحذف
    if (orderData.status === ORDER_STATUS.ACCEPTED) {
      for (const item of orderData.items) {
        const product = await getProductById(item.productId);
        const newSizes = { ...product.sizes };
        newSizes[item.size] = (newSizes[item.size] || 0) + item.quantity;
        
        await updateProductQuantity(item.productId, newSizes);
      }
    }
    
    await deleteDoc(orderRef);
    
    return {
      success: true,
      message: 'تم حذف الطلب بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في حذف الطلب:', error);
    throw new Error('فشل حذف الطلب');
  }
};

// احصائيات الطلبات
export const getOrdersStats = async () => {
  try {
    const orders = await getAllOrders();
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === ORDER_STATUS.PENDING).length,
      accepted: orders.filter(o => o.status === ORDER_STATUS.ACCEPTED).length,
      rejected: orders.filter(o => o.status === ORDER_STATUS.REJECTED).length,
      totalRevenue: orders
        .filter(o => o.status === ORDER_STATUS.ACCEPTED)
        .reduce((sum, order) => sum + order.totalPrice, 0)
    };
    
    return stats;
    
  } catch (error) {
    console.error('خطأ في جلب احصائيات الطلبات:', error);
    throw new Error('فشل جلب الاحصائيات');
  }
};

// تحديث كامل للطلب (تعديل المنتجات/الكميات/السعر)
export const updateOrder = async (orderId, updatedOrderData) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      throw new Error('الطلب غير موجود');
    }

    const existingOrder = orderSnap.data();

    // إذا كان الطلب مقبولاً مسبقاً، يجب تعديل كميات المنتجات بناءً على الفرق
    if (existingOrder.status === ORDER_STATUS.ACCEPTED) {
      // بنية: map[productId|size] = qty
      const oldMap = {};
      for (const it of existingOrder.items) {
        const key = `${it.productId}|${it.size}`;
        oldMap[key] = (oldMap[key] || 0) + (it.quantity || 0);
      }

      const newMap = {};
      for (const it of updatedOrderData.items) {
        const key = `${it.productId}|${it.size}`;
        newMap[key] = (newMap[key] || 0) + (it.quantity || 0);
      }

      // احسب دلتا لكل منتج/مقاس: delta = new - old
      const allKeys = new Set([...Object.keys(oldMap), ...Object.keys(newMap)]);

      for (const key of allKeys) {
        const [productId, size] = key.split('|');
        const oldQty = oldMap[key] || 0;
        const newQty = newMap[key] || 0;
        const delta = newQty - oldQty; // >0 => نحتاج ان ننقص من المخزون مجدداً

        if (delta === 0) continue;

        const product = await getProductById(productId);
        const updatedSizes = { ...product.sizes };

        // عندما يكون delta > 0، نحتاج لتخفيض المخزون بمقدار دلتا
        // عندما يكون delta < 0، نعيد الكمية للمخزون
        updatedSizes[size] = (updatedSizes[size] || 0) - delta;

        if (updatedSizes[size] < 0) {
          throw new Error(`الكمية المطلوبة من ${product.name} (مقاس ${size}) غير متوفرة بعد التعديل`);
        }

        await updateProductQuantity(productId, updatedSizes);
      }
    }

    // تحديث بيانات الطلب في Firestore
    await updateDoc(orderRef, {
      ...updatedOrderData,
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      message: 'تم تحديث الطلب بنجاح'
    };

  } catch (error) {
    console.error('خطأ في تحديث الطلب:', error);
    throw error;
  }
};