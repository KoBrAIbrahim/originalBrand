import React, { useState, useEffect } from 'react';
import AdminDialog from '../common/AdminDialog';
import { X, Upload, Trash2 } from 'lucide-react';
import { CATEGORIES, SIZES, PRODUCT_COLORS } from '../../utils/constants';
import { uploadMultipleImages } from '../../services/storageService';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const isEditMode = !!product;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    purchasePrice: '',
    sellPrice: '',
    category: CATEGORIES[0],
    colors: [],
    sizes: {},
    images: []
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        purchasePrice: product.purchasePrice || '',
        sellPrice: product.sellPrice || '',
        category: product.category || CATEGORIES[0],
        colors: product.colors || [],
        sizes: product.sizes || {},
        images: product.images || []
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleColorToggle = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleSizeChange = (size, quantity) => {
    setFormData(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: parseInt(quantity) || 0
      }
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'اسم المنتج مطلوب';
    if (!formData.description.trim()) newErrors.description = 'الوصف مطلوب';
    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'سعر الشراء غير صحيح';
    }
    if (!formData.sellPrice || parseFloat(formData.sellPrice) <= 0) {
      newErrors.sellPrice = 'سعر البيع غير صحيح';
    }
    if (formData.colors.length === 0) newErrors.colors = 'اختر لون واحد على الأقل';
    if (Object.keys(formData.sizes).length === 0) newErrors.sizes = 'أضف مقاس واحد على الأقل';
    if (formData.images.length === 0 && selectedFiles.length === 0) {
      newErrors.images = 'أضف صورة واحدة على الأقل';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setUploading(true);

    try {
      let imageUrls = [...formData.images];

      // رفع الصور الجديدة
      if (selectedFiles.length > 0) {
        const uploadResult = await uploadMultipleImages(selectedFiles);
        imageUrls = [...imageUrls, ...uploadResult.urls];
      }

      const productData = {
        ...formData,
        purchasePrice: parseFloat(formData.purchasePrice),
        sellPrice: parseFloat(formData.sellPrice),
        images: imageUrls
      };

      await onSubmit(productData);
    } catch (error) {
      setErrorDialog({ open: true, message: error.message || 'حدث خطأ أثناء حفظ المنتج' });
    } finally {
      setUploading(false);
    }
  };

  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });

  const availableSizes = SIZES[formData.category] || [];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {isEditMode ? 'تعديل منتج' : 'إضافة منتج جديد'}
          </h2>
          <button onClick={onCancel} style={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">اسم المنتج</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="مثال: حذاء رياضي نايكي"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">الوصف</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="وصف المنتج..."
              rows={3}
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          {/* Prices */}
          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">سعر الشراء (₪)</label>
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                className="form-input"
                placeholder="100"
                min="0"
                step="0.01"
              />
              {errors.purchasePrice && <p className="form-error">{errors.purchasePrice}</p>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">سعر البيع (₪)</label>
              <input
                type="number"
                name="sellPrice"
                value={formData.sellPrice}
                onChange={handleChange}
                className="form-input"
                placeholder="150"
                min="0"
                step="0.01"
              />
              {errors.sellPrice && <p className="form-error">{errors.sellPrice}</p>}
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">الفئة</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Colors */}
          <div className="form-group">
            <label className="form-label">الألوان</label>
            <div style={styles.colorsGrid}>
              {PRODUCT_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorToggle(color)}
                  style={{
                    ...styles.colorButton,
                    ...(formData.colors.includes(color) ? styles.colorButtonActive : {})
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
            {errors.colors && <p className="form-error">{errors.colors}</p>}
          </div>

          {/* Sizes */}
          <div className="form-group">
            <label className="form-label">المقاسات والكميات</label>
            <div style={styles.sizesGrid}>
              {availableSizes.map(size => (
                <div key={size} style={styles.sizeItem}>
                  <label style={styles.sizeLabel}>{size}</label>
                  <input
                    type="number"
                    value={formData.sizes[size] || ''}
                    onChange={(e) => handleSizeChange(size, e.target.value)}
                    className="form-input"
                    placeholder="0"
                    min="0"
                    style={{ textAlign: 'center' }}
                  />
                </div>
              ))}
            </div>
            {errors.sizes && <p className="form-error">{errors.sizes}</p>}
          </div>

          {/* Images */}
          <div className="form-group">
            <label className="form-label">الصور</label>
            
            {/* Existing Images */}
            {formData.images.length > 0 && (
              <div style={styles.imagesGrid}>
                {formData.images.map((image, index) => (
                  <div key={index} style={styles.imagePreview}>
                    <img src={image} alt={`صورة ${index + 1}`} style={styles.previewImage} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      style={styles.removeImageButton}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload New Images */}
            <div style={styles.uploadContainer}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" style={styles.uploadButton}>
                <Upload size={24} />
                <span>اختر صور ({selectedFiles.length} محددة)</span>
              </label>
            </div>
            {errors.images && <p className="form-error">{errors.images}</p>}
          </div>

          {/* Submit Buttons */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={uploading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading ? 'جاري الحفظ...' : isEditMode ? 'تحديث' : 'إضافة'}
            </button>
          </div>
        </form>
        {/* Error dialog */}
        <AdminDialog
          open={errorDialog.open}
          title="حدث خطأ"
          onConfirm={() => setErrorDialog({ open: false, message: '' })}
          onCancel={() => setErrorDialog({ open: false, message: '' })}
          showCancel={false}
          confirmText="حسناً"
        >
          <p>{errorDialog.message}</p>
        </AdminDialog>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
    overflowY: 'auto'
  },
  modal: {
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    backgroundColor: 'var(--secondary-color)',
    zIndex: 10
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-color)',
    padding: '0.5rem'
  },
  form: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  row: {
    display: 'flex',
    gap: '1rem'
  },
  colorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '0.75rem'
  },
  colorButton: {
    padding: '0.75rem',
    border: '2px solid var(--border-color)',
    borderRadius: '8px',
    backgroundColor: 'var(--secondary-color)',
    cursor: 'pointer',
    fontSize: '0.9375rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    fontFamily: 'Cairo, sans-serif'
  },
  colorButtonActive: {
    borderColor: 'var(--primary-color)',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)'
  },
  sizesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '1rem'
  },
  sizeItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  sizeLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-color)'
  },
  imagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  },
  imagePreview: {
    position: 'relative',
    paddingTop: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'var(--background-color)'
  },
  previewImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  removeImageButton: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    width: '32px',
    height: '32px',
    backgroundColor: 'var(--error-color)',
    color: 'var(--secondary-color)',
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  uploadContainer: {
    marginTop: '0.5rem'
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '1rem',
    border: '2px dashed var(--border-color)',
    borderRadius: '8px',
    backgroundColor: 'var(--background-color)',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-color)',
    transition: 'all 0.3s ease'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-color)',
    marginTop: '1rem'
  }
};

export default ProductForm;