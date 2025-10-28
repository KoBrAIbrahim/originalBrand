import { useState, useEffect } from 'react';
import {
  getAllOrders,
  getOrdersByStatus,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  updateOrder,
  getOrdersStats
} from '../services/orderService';

export const useOrders = (status = null) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب الطلبات
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (status) {
        data = await getOrdersByStatus(status);
      } else {
        data = await getAllOrders();
      }

      setOrders(data);
    } catch (err) {
      setError(err.message);
      console.error('خطأ في جلب الطلبات:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);

  // إنشاء طلب جديد
  const addOrder = async (orderData) => {
    try {
      setError(null);
      const result = await createOrder(orderData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // تحديث حالة الطلب
  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      setError(null);
      const result = await updateOrderStatus(orderId, newStatus);
      await fetchOrders(); // تحديث القائمة
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // حذف طلب
  const removeOrder = async (orderId) => {
    try {
      setError(null);
      const result = await deleteOrder(orderId);
      await fetchOrders(); // تحديث القائمة
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // تحديث كامل للطلب
  const updateExistingOrder = async (orderId, updatedOrderData) => {
    try {
      setError(null);
      const result = await updateOrder(orderId, updatedOrderData);
      await fetchOrders();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    addOrder,
    changeOrderStatus,
    removeOrder,
    updateExistingOrder
  };
};

// Hook للحصول على طلب واحد
export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError(err.message);
        console.error('خطأ في جلب الطلب:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return {
    order,
    loading,
    error
  };
};

// Hook لإحصائيات الطلبات
export const useOrdersStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrdersStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
      console.error('خطأ في جلب الإحصائيات:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
};