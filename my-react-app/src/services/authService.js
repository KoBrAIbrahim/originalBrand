import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './firebase';
import { saveAuthData, clearAuthData, getAuthData } from '../utils/localStorage';

// تسجيل الدخول باستخدام Firebase Authentication
export const loginAdmin = async (email, password) => {
  try {
    // تسجيل الدخول باستخدام Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // حفظ بيانات المستخدم في LocalStorage
    const authData = {
      uid: user.uid,
      email: user.email,
      loginTime: new Date().toISOString()
    };
    
    saveAuthData(authData);
    
    return {
      success: true,
      user: authData
    };
    
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    
    // رسائل خطأ مخصصة
    let errorMessage = 'حدث خطأ في تسجيل الدخول';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'البريد الإلكتروني غير صحيح';
        break;
      case 'auth/user-disabled':
        errorMessage = 'هذا الحساب معطل';
        break;
      case 'auth/user-not-found':
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        break;
      case 'auth/wrong-password':
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'تم تجاوز عدد المحاولات، حاول لاحقاً';
        break;
      default:
        errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// تسجيل الخروج
export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    clearAuthData();
    return { success: true };
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
    throw error;
  }
};

// التحقق من تسجيل الدخول
export const checkAuth = () => {
  const authData = getAuthData();
  const currentUser = auth.currentUser;
  return authData !== null && currentUser !== null;
};

// الحصول على بيانات المستخدم الحالي
export const getCurrentUser = () => {
  return getAuthData();
};

// مراقبة حالة المصادقة
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const authData = {
        uid: user.uid,
        email: user.email,
        loginTime: new Date().toISOString()
      };
      saveAuthData(authData);
      callback(authData);
    } else {
      clearAuthData();
      callback(null);
    }
  });
};