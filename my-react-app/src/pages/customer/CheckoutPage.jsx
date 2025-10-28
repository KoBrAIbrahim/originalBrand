import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import CheckoutForm from '../../components/customer/CheckoutForm';
import { formatPrice } from '../../utils/helpers';
import { ShoppingBag } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, isEmpty } = useCart();

  // إذا كانت السلة فارغة، نعيد التوجيه للسلة
  React.useEffect(() => {
    if (isEmpty) {
      navigate('/cart');
    }
  }, [isEmpty, navigate]);

  if (isEmpty) {
    return null; // سيتم التوجيه تلقائياً
  }

  return (
    <div className="container" style={styles.container}>
      <div style={styles.content}>
        {/* Order Summary */}
        <div style={styles.summarySection}>
          <h2 style={styles.sectionTitle}>
            <ShoppingBag size={24} style={{ marginLeft: '0.5rem' }} />
            ملخص الطلب
          </h2>
          
          <div style={styles.orderItems}>
            {cart.map((item, index) => (
              <div key={index} style={styles.orderItem}>
                <div style={styles.itemInfo}>
                  <img 
                    src={item.image || '/placeholder.png'}
                    alt={item.productName}
                    style={styles.itemImage}
                  />
                  <div style={styles.itemDetails}>
                    <h4 style={styles.itemName}>{item.productName}</h4>
                    <div style={styles.itemSpecs}>
                      <span>المقاس: {item.size}</span>
                      <span>اللون: {item.color}</span>
                      <span>الكمية: {item.quantity}</span>
                    </div>
                  </div>
                </div>
                <span style={styles.itemPrice}>
                  {formatPrice((item.salePrice || item.sellPrice) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div style={styles.totalContainer}>
            <span style={styles.totalLabel}>الإجمالي:</span>
            <span style={styles.totalPrice}>{formatPrice(getTotalPrice())}</span>
          </div>

          <div className="alert alert-info">
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9375rem' }}>
              ℹ️ الدفع عند الاستلام فقط
            </p>
          </div>
        </div>

        {/* Checkout Form */}
        <div style={styles.formSection}>
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '2rem',
    paddingBottom: '4rem',
    minHeight: 'calc(100vh - 200px)'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    alignItems: 'start'
  },
  summarySection: {
    position: 'sticky',
    top: '100px'
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center'
  },
  orderItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)'
  },
  itemInfo: {
    display: 'flex',
    gap: '1rem',
    flex: 1
  },
  itemImage: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  itemName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-color)',
    margin: 0
  },
  itemSpecs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.875rem',
    color: 'var(--text-light)'
  },
  itemPrice: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--primary-color)'
  },
  totalContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    borderRadius: '12px',
    marginBottom: '1rem'
  },
  totalLabel: {
    fontSize: '1.25rem',
    fontWeight: 700
  },
  totalPrice: {
    fontSize: '1.75rem',
    fontWeight: 700
  },
  formSection: {
    // Form styling is handled in CheckoutForm component
  }
};

// Responsive styles
const mediaStyles = `
  @media (max-width: 1024px) {
    .checkoutContent {
      grid-template-columns: 1fr !important;
    }
    .checkoutSummary {
      position: static !important;
      order: 2;
    }
    .checkoutForm {
      order: 1;
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mediaStyles;
  if (!document.head.querySelector('style[data-checkout-page]')) {
    styleSheet.setAttribute('data-checkout-page', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default CheckoutPage;