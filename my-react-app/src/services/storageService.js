import { 
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { storage } from './firebase';
import { compressImage } from '../utils/helpers';

// رفع صورة واحدة
export const uploadImage = async (file, path = 'products') => {
  try {
    // ضغط الصورة قبل الرفع
    const compressedFile = await compressImage(file);
    
    // إنشاء اسم فريد للصورة
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    
    // رفع الصورة
    const snapshot = await uploadBytes(storageRef, compressedFile);
    
    // الحصول على رابط التحميل
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      url: downloadURL,
      path: snapshot.ref.fullPath
    };
    
  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    throw new Error('فشل رفع الصورة');
  }
};

// رفع عدة صور
export const uploadMultipleImages = async (files, path = 'products') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, path));
    const results = await Promise.all(uploadPromises);
    
    return {
      success: true,
      urls: results.map(result => result.url),
      paths: results.map(result => result.path)
    };
    
  } catch (error) {
    console.error('خطأ في رفع الصور:', error);
    throw new Error('فشل رفع الصور');
  }
};

// حذف صورة
export const deleteImage = async (imagePath) => {
  try {
    if (!imagePath) {
      throw new Error('مسار الصورة غير موجود');
    }
    
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    
    return {
      success: true,
      message: 'تم حذف الصورة بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في حذف الصورة:', error);
    throw new Error('فشل حذف الصورة');
  }
};

// حذف عدة صور
export const deleteMultipleImages = async (imagePaths) => {
  try {
    const deletePromises = imagePaths.map(path => deleteImage(path));
    await Promise.all(deletePromises);
    
    return {
      success: true,
      message: 'تم حذف الصور بنجاح'
    };
    
  } catch (error) {
    console.error('خطأ في حذف الصور:', error);
    throw new Error('فشل حذف الصور');
  }
};

// استخراج مسار الصورة من الرابط
export const extractImagePath = (url) => {
  try {
    if (!url) return null;
    
    // استخراج المسار من رابط Firebase Storage
    const match = url.match(/\/o\/(.+?)\?/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    
    return null;
  } catch (error) {
    console.error('خطأ في استخراج مسار الصورة:', error);
    return null;
  }
};