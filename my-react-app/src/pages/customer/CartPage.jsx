import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import CartItem from '../../components/customer/CartItem';
import OrderDialog from '../../components/customer/OrderDialog';
import { formatPrice } from '../../utils/helpers';

const CartPage = () => {
  // navigate removed because we open a modal dialog instead of navigating
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotalPrice,
    isEmpty 
  } = useCart();

  const handleClearCart = () => {
    if (window.confirm('هل تريد إفراغ السلة؟')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    // Open modal dialog to complete order
    setShowDialog(true);
  };

  const [showDialog, setShowDialog] = React.useState(false);

  if (isEmpty) {
    return (
      <div className="container" style={styles.emptyContainer}>
        <div style={styles.emptyContent}>
          <ShoppingCart size={80} color="var(--border-color)" />
          <h2 style={styles.emptyTitle}>السلة فارغة</h2>
          <p style={styles.emptyText}>
            لم تقم بإضافة أي منتجات إلى السلة بعد
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <ShoppingCart size={32} style={{ marginLeft: '0.75rem' }} />
          السلة ({cart.length})
        </h1>
        <button 
          onClick={handleClearCart}
          style={styles.clearButton}
        >
          <Trash2 size={20} />
          <span>إفراغ السلة</span>
        </button>
      </div>

      <div style={styles.content} className="cart-content">
        {/* Cart Items */}
        <div style={styles.itemsContainer} className="cart-items">
          {cart.map((item) => (
            <CartItem
              key={`${item.productId}-${item.size}-${item.color}`}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {/* Summary */}
        <div style={styles.summary} className="cart-summary">
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>ملخص الطلب</h3>
            
            <div style={styles.summaryDetails}>
              <div style={styles.summaryRow}>
                <span>عدد المنتجات:</span>
                <span>{cart.length}</span>
              </div>
              
              <div style={styles.summaryRow}>
                <span>إجمالي الكمية:</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>

              <div style={{...styles.summaryRow, ...styles.totalRow}}>
                <span>الإجمالي:</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
            </div>

            <div className="alert alert-info" style={{ marginTop: '1rem' }}>
              <p style={{ margin: 0, fontSize: '0.9375rem' }}>
                💰 الدفع عند الاستلام
              </p>
            </div>

            <button 
              onClick={handleCheckout}
              className="btn btn-primary"
              style={styles.checkoutButton}
            >
              إتمام الطلب
            </button>

            {/* Order dialog modal */}
            <OrderDialog open={showDialog} onClose={() => setShowDialog(false)} />

            <Link 
              to="/"
              className="btn btn-secondary"
              style={styles.continueButton}
            >
              متابعة التسوق
            </Link>
          </div>
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
  emptyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)'
  },
  emptyContent: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  emptyTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0
  },
  emptyText: {
    fontSize: '1.125rem',
    color: 'var(--text-light)',
    margin: 0
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0,
    display: 'flex',
    alignItems: 'center'
  },
  clearButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: '2px solid var(--error-color)',
    borderRadius: '8px',
    color: 'var(--error-color)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'Cairo, sans-serif'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
    alignItems: 'start'
  },
  itemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  summary: {
    // position handled via CSS to allow responsive overrides
  },
  summaryCard: {
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow)'
  },
  summaryTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    marginBottom: '1.5rem'
  },
  summaryDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-color)'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
    color: 'var(--text-color)'
  },
  totalRow: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--primary-color)',
    paddingTop: '1rem',
    borderTop: '2px solid var(--border-color)'
  },
  checkoutButton: {
    width: '100%',
    marginTop: '1.5rem',
    padding: '1rem',
    fontSize: '1.125rem'
  },
  continueButton: {
    width: '100%',
    marginTop: '0.75rem',
    padding: '1rem',
    fontSize: '1rem',
    textAlign: 'center'
  }
};

// Responsive styles

export default CartPage;