import React, { useState } from 'react';
import { User, MapPin, Phone, X, CheckCircle } from 'lucide-react';
import { isValidWhatsApp } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';

const OrderDialog = ({ open, onClose }) => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [formData, setFormData] = useState({
    customerName: '',
    fullAddress: '',
    city: '',
    town: '',
    whatsapp: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'الاسم الكامل مطلوب';
    if (!formData.fullAddress.trim()) newErrors.fullAddress = 'العنوان الكامل مطلوب';
    if (!formData.city.trim()) newErrors.city = 'المدينة مطلوبة';
    if (!formData.town.trim()) newErrors.town = 'البلدة مطلوبة';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'رقم الواتساب مطلوب';
    else if (!isValidWhatsApp(formData.whatsapp)) newErrors.whatsapp = 'رقم الواتساب غير صحيح';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        ...formData,
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.productName,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.salePrice || item.sellPrice
        })),
        totalPrice: getTotalPrice()
      };

      const result = await addOrder(orderData);
      if (result && result.success) {
        // clear the cart, show success toast for 3 seconds then close
        clearCart();
        setShowSuccess(true);
        // keep the dialog open while showing success; then close after 3s
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (err) {
      alert(err.message || 'فشل إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-dialog-backdrop" style={styles.backdrop} onClick={showSuccess ? undefined : onClose}>
      <div className="order-dialog" style={styles.dialog} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>إتمام الطلب</h3>
          <button onClick={onClose} style={styles.closeButton} aria-label="إغلاق">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label className="form-label">الاسم الكامل</label>
          <div className="form-group">
            <input name="customerName" value={formData.customerName} onChange={handleChange} className="form-input" />
            {errors.customerName && <p className="form-error">{errors.customerName}</p>}
          </div>

          <label className="form-label">المدينة</label>
          <div className="form-group">
            <input name="city" value={formData.city} onChange={handleChange} className="form-input" />
            {errors.city && <p className="form-error">{errors.city}</p>}
          </div>

          <label className="form-label">البلدة</label>
          <div className="form-group">
            <input name="town" value={formData.town} onChange={handleChange} className="form-input" />
            {errors.town && <p className="form-error">{errors.town}</p>}
          </div>

          <label className="form-label">العنوان الكامل</label>
          <div className="form-group">
            <textarea name="fullAddress" value={formData.fullAddress} onChange={handleChange} className="form-textarea" rows={3} />
            {errors.fullAddress && <p className="form-error">{errors.fullAddress}</p>}
          </div>

          <label className="form-label">رقم الواتساب</label>
          <div className="form-group">
            <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="form-input" dir="ltr" />
            {errors.whatsapp && <p className="form-error">{errors.whatsapp}</p>}
          </div>

          <div className="alert alert-info">
            <p style={{ margin: 0, fontWeight: 600 }}>سيتم تأكيد العملية عن طريق رقم الواتس اب</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
            </button>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>إلغاء</button>
          </div>
        </form>
      </div>
      {/* Success toast shown after successful submission */}
      {showSuccess && (
        <div className="order-success-toast" role="status" aria-live="polite">
          <div className="order-success-inner">
            <CheckCircle size={36} color="#28a745" />
            <div style={{ marginLeft: '0.5rem', fontWeight: 700 }}>تم إرسال طلبك بنجاح</div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  dialog: {
    width: 'min(680px, 95vw)',
    background: 'var(--secondary-color)',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: 'var(--shadow)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  }
};

export default OrderDialog;
