import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone } from 'lucide-react';
import { isValidWhatsApp } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';

const CheckoutForm = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'الاسم الكامل مطلوب';
    }

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = 'العنوان الكامل مطلوب';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'المدينة مطلوبة';
    }

    if (!formData.town.trim()) {
      newErrors.town = 'البلدة مطلوبة';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'رقم الواتساب مطلوب';
    } else if (!isValidWhatsApp(formData.whatsapp)) {
      newErrors.whatsapp = 'رقم الواتساب غير صحيح';
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

      if (result.success) {
        clearCart();
        alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
        navigate('/');
      }
    } catch (error) {
      alert(error.message || 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>إتمام الطلب</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Customer Name */}
        <div className="form-group">
          <label className="form-label">
            <User size={20} style={{ marginLeft: '0.5rem' }} />
            الاسم الكامل
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="form-input"
            placeholder="أدخل اسمك الكامل"
          />
          {errors.customerName && (
            <p className="form-error">{errors.customerName}</p>
          )}
        </div>

        {/* Full Address */}
        <div className="form-group">
          <label className="form-label">
            <MapPin size={20} style={{ marginLeft: '0.5rem' }} />
            العنوان الكامل
          </label>
          <textarea
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange}
            className="form-textarea"
            placeholder="مثال: شارع الرئيسي، بجانب المسجد، الطابق الثاني"
            rows={3}
          />
          {errors.fullAddress && (
            <p className="form-error">{errors.fullAddress}</p>
          )}
        </div>

        {/* City and Town */}
        <div style={styles.row}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">المدينة</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="form-input"
              placeholder="مثال: رام الله"
            />
            {errors.city && (
              <p className="form-error">{errors.city}</p>
            )}
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">البلدة</label>
            <input
              type="text"
              name="town"
              value={formData.town}
              onChange={handleChange}
              className="form-input"
              placeholder="مثال: البيرة"
            />
            {errors.town && (
              <p className="form-error">{errors.town}</p>
            )}
          </div>
        </div>

        {/* WhatsApp */}
        <div className="form-group">
          <label className="form-label">
            <Phone size={20} style={{ marginLeft: '0.5rem' }} />
            رقم الواتساب
          </label>
          <input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="form-input"
            placeholder="059XXXXXXX"
            dir="ltr"
            style={{ textAlign: 'right' }}
          />
          {errors.whatsapp && (
            <p className="form-error">{errors.whatsapp}</p>
          )}
        </div>

        {/* Payment Info */}
        <div className="alert alert-info" style={{ marginTop: '1rem' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>
            💰 الدفع عند الاستلام فقط
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9375rem' }}>
            سيتم التواصل معك عبر الواتساب لتأكيد الطلب والعنوان
          </p>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn btn-primary"
          style={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  row: {
    display: 'flex',
    gap: '1rem'
  },
  submitButton: {
    marginTop: '1rem',
    padding: '1rem',
    fontSize: '1.125rem'
  }
};

// Responsive styles

export default CheckoutForm;