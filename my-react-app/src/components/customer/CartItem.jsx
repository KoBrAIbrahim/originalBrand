import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const price = item.salePrice || item.sellPrice;
  const totalPrice = price * item.quantity;

  const handleIncrement = () => {
    onUpdateQuantity(item.productId, item.size, item.color, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.size, item.color, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    if (window.confirm('هل تريد حذف هذا المنتج من السلة؟')) {
      onRemove(item.productId, item.size, item.color);
    }
  };

  return (
    <div style={styles.container} className="cart-item">
      {/* Product Image */}
  <div style={styles.imageContainer} className="imageContainer">
        <img 
          src={item.image || '/placeholder.png'} 
          alt={item.productName}
          style={styles.image}
        />
      </div>

      {/* Product Info */}
  <div style={styles.infoContainer}>
        <h3 style={styles.productName}>{item.productName}</h3>
        <div style={styles.details}>
          <span style={styles.detailItem}>المقاس: {item.size}</span>
          <span style={styles.detailItem}>اللون: {item.color}</span>
        </div>
        <div style={styles.priceContainer}>
          <span style={styles.price}>{formatPrice(price)}</span>
          <span style={styles.totalPrice}>الإجمالي: {formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Quantity Controls */}
  <div style={styles.quantityContainer} className="quantityContainer">
        <button 
          onClick={handleDecrement}
          style={styles.quantityButton}
          disabled={item.quantity <= 1}
        >
          <Minus size={18} />
        </button>
        <span style={styles.quantity}>{item.quantity}</span>
        <button 
          onClick={handleIncrement}
          style={styles.quantityButton}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Remove Button */}
      <button 
        onClick={handleRemove}
        style={styles.removeButton}
        className="removeButton"
        aria-label="حذف"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr auto auto',
    gap: '1.5rem',
    padding: '1.5rem',
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    alignItems: 'center'
  },
  imageContainer: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'var(--background-color)'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  productName: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0
  },
  details: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  detailItem: {
    fontSize: '0.9375rem',
    color: 'var(--text-light)',
    padding: '0.25rem 0.75rem',
    backgroundColor: 'var(--background-color)',
    borderRadius: '6px'
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  price: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--primary-color)'
  },
  totalPrice: {
    fontSize: '0.9375rem',
    color: 'var(--text-light)'
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem',
    backgroundColor: 'var(--background-color)',
    borderRadius: '8px'
  },
  quantityButton: {
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  quantity: {
    fontSize: '1.125rem',
    fontWeight: 700,
    minWidth: '40px',
    textAlign: 'center',
    color: 'var(--text-color)'
  },
  removeButton: {
    width: '48px',
    height: '48px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'var(--error-color)',
    color: 'var(--secondary-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};

// Responsive styles

export default CartItem;