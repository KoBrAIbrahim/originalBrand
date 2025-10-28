import React, { useState } from 'react';
import { X, Tag } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

const SaleForm = ({ product, onSubmit, onCancel }) => {
  const [salePrice, setSalePrice] = useState(product.salePrice || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const price = parseFloat(salePrice);
    
    if (!salePrice || isNaN(price) || price <= 0) {
      setError('السعر غير صحيح');
      return;
    }

    if (price >= product.sellPrice) {
      setError('سعر التخفيض يجب أن يكون أقل من سعر البيع');
      return;
    }

    onSubmit(price);
  };

  const discountPercentage = salePrice 
    ? Math.round(((product.sellPrice - parseFloat(salePrice)) / product.sellPrice) * 100)
    : 0;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <Tag size={24} style={{ marginLeft: '0.5rem' }} />
            إضافة تخفيض
          </h2>
          <button onClick={onCancel} style={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.content}>
          {/* Product Info */}
          <div style={styles.productInfo}>
            <img 
              src={product.images && product.images[0] || '/placeholder.png'}
              alt={product.name}
              style={styles.productImage}
            />
            <div>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.originalPrice}>
                السعر الأصلي: {formatPrice(product.sellPrice)}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="form-group">
              <label className="form-label">سعر التخفيض (₪)</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => {
                  setSalePrice(e.target.value);
                  setError('');
                }}
                className="form-input"
                placeholder="أدخل السعر بعد التخفيض"
                min="0"
                step="0.01"
                autoFocus
              />
              {error && <p className="form-error">{error}</p>}
            </div>

            {/* Discount Info */}
            {salePrice && !error && discountPercentage > 0 && (
              <div className="alert alert-success">
                <p style={{ margin: 0, fontWeight: 600 }}>
                  نسبة التخفيض: {discountPercentage}%
                </p>
                <p style={{ margin: '0.5rem 0 0 0' }}>
                  السعر الجديد: {formatPrice(parseFloat(salePrice))}
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={styles.actions}>
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                إضافة التخفيض
              </button>
            </div>
          </form>
        </div>
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
    padding: '1rem'
  },
  modal: {
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid var(--border-color)'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
    display: 'flex',
    alignItems: 'center'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-color)',
    padding: '0.5rem'
  },
  content: {
    padding: '1.5rem'
  },
  productInfo: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: 'var(--background-color)',
    borderRadius: '8px'
  },
  productImage: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  productName: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: '0 0 0.5rem 0'
  },
  originalPrice: {
    fontSize: '1rem',
    color: 'var(--text-light)',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-color)'
  }
};

export default SaleForm;