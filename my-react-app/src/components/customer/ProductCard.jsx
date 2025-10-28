import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const displayPrice = product.salePrice || product.sellPrice;
  const hasDiscount = product.salePrice && product.salePrice < product.sellPrice;

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div className="card">
        {/* Product Image */}
        <div style={styles.imageContainer}>
          <img 
            src={product.images && product.images[0] || '/placeholder.png'} 
            alt={product.name}
            className="card-image"
          />
          {hasDiscount && (
            <div style={styles.discountBadge}>
              تخفيض
            </div>
          )}
          {product.totalQuantity === 0 && (
            <div style={styles.outOfStockBadge}>
              نفذت الكمية
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="card-body">
          <h3 className="card-title">{product.name}</h3>
          <p className="card-text">{product.description}</p>
          
          {/* Category Badge */}
          <div style={{ marginBottom: '0.75rem' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
              {product.category}
            </span>
          </div>

          {/* Price */}
          <div style={styles.priceContainer}>
            <span className="card-price">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="card-price-old">
                {formatPrice(product.sellPrice)}
              </span>
            )}
          </div>

          {/* Colors Available */}
          {product.colors && product.colors.length > 0 && (
            <div style={styles.colorsInfo}>
              <span style={styles.colorsText}>
                {product.colors.length} {product.colors.length === 1 ? 'لون' : 'ألوان'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

const styles = {
  imageContainer: {
    position: 'relative',
    overflow: 'hidden'
  },
  discountBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'var(--error-color)',
    color: 'var(--secondary-color)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 700,
    boxShadow: 'var(--shadow)'
  },
  outOfStockBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'var(--secondary-color)',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1.125rem',
    fontWeight: 700
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem'
  },
  colorsInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--border-color)'
  },
  colorsText: {
    fontSize: '0.875rem',
    color: 'var(--text-light)'
  }
};

export default ProductCard;