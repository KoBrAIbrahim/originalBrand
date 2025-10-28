import { useState, useEffect } from 'react';
import {
  loginAdmin,
  logoutAdmin,
  getCurrentUser,
  onAuthChange
} from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // التحقق من تسجيل الدخول عند تحميل الصفحة
  // Subscribe to Firebase auth state changes so we don't rely on auth.currentUser synchronously
  useEffect(() => {
    // Optionally seed user from localStorage to avoid UI flicker while Firebase initializes
    const local = getCurrentUser();
    if (local) setUser(local);

    const unsubscribe = onAuthChange((authData) => {
      if (authData) {
        setUser(authData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // cleanup subscription on unmount
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // تسجيل الدخول
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await loginAdmin(username, password);
      setUser(result.user);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await logoutAdmin();
      setUser(null);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
};