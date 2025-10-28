import { useState, useEffect } from 'react';
import {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  createSale,
  removeSale
} from '../services/productService';

export const useProducts = (category = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب المنتجات
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (category) {
        data = await getProductsByCategory(category);
      } else {
        data = await getAllProducts();
      }

      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('خطأ في جلب المنتجات:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  // إضافة منتج
  const addNewProduct = async (productData) => {
    try {
      setError(null);
      const result = await addProduct(productData);
      await fetchProducts(); // تحديث القائمة
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // تحديث منتج
  const updateExistingProduct = async (productId, productData) => {
    try {
      setError(null);
      const result = await updateProduct(productId, productData);
      await fetchProducts(); // تحديث القائمة
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // حذف منتج
  const removeProduct = async (productId) => {
    try {
      setError(null);
      const result = await deleteProduct(productId);
      await fetchProducts(); // تحديث القائمة
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // إضافة تخفيض
  const addSale = async (productId, salePrice) => {
    try {
      setError(null);
      const result = await createSale(productId, salePrice);
      await fetchProducts(); // تحديث القائمة
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // إلغاء تخفيض
  const cancelSale = async (productId) => {
    try {
      setError(null);
      const result = await removeSale(productId);
      await fetchProducts(); // تحديث القائمة
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    addNewProduct,
    updateExistingProduct,
    removeProduct,
    addSale,
    cancelSale
  };
};

// Hook للحصول على منتج واحد
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error('خطأ في جلب المنتج:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error
  };
};