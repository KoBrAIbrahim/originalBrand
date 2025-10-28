import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { formatPrice, getAvailableSizes } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';

const ProductDetails = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const { addToCart } = useCart();

  const displayPrice = product.salePrice || product.sellPrice;
  const hasDiscount = product.salePrice && product.salePrice < product.sellPrice;
  const availableSizes = getAvailableSizes(product);
  const mobileStripRef = useRef(null);

  // Sync selectedImage with user swiping the mobile image strip.
  useEffect(() => {
    const strip = mobileStripRef.current;
    if (!strip) return;

    const imgs = Array.from(strip.querySelectorAll('img'));
    if (imgs.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = imgs.indexOf(entry.target);
          if (idx >= 0 && idx !== selectedImage) {
            setSelectedImage(idx);
          }
        }
      });
    }, { threshold: 0.6 });

    imgs.forEach(img => observer.observe(img));

    return () => observer.disconnect();
  }, [mobileStripRef, selectedImage]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('الرجاء اختيار المقاس');
      return;
    }
    if (!selectedColor) {
      alert('الرجاء اختيار اللون');
      return;
    }

    const maxQuantity = product.sizes[selectedSize] || 0;
    if (quantity > maxQuantity) {
      alert(`الكمية المتوفرة: ${maxQuantity}`);
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const incrementQuantity = () => {
    const maxQuantity = selectedSize ? product.sizes[selectedSize] : 99;
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div style={styles.container}>
      {/* Success Message */}
      {showSuccess && (
        <div className="alert alert-success" style={styles.successMessage}>
          تمت إضافة المنتج إلى السلة بنجاح!
        </div>
      )}

      <div style={styles.content} className="product-content">
        {/* Images Section */}
        <div style={styles.imagesSection} className="images-section">
          {/* Mobile horizontal image strip (shown only on mobile via CSS) */}
          {product.images && product.images.length > 0 && (
            <>
            <div className="mobile-image-strip" ref={mobileStripRef}>
              {product.images.map((img, idx) => (
                <figure key={idx} className="mobile-image-figure">
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    onClick={() => setSelectedImage(idx)}
                  />
                  <div className="mobile-figure-details">
                    <h2 className="mobile-figure-title">{product.name}</h2>
                    <div className="mobile-figure-category">
                      <span className="badge badge-primary">{product.category}</span>
                    </div>
                    <p className="mobile-figure-description">{product.description}</p>
                  </div>
                </figure>
              ))}
            </div>
            {/* Mobile-only controls shown under the image strip (sizes, colors, qty, add to cart) */}
            <div className="mobile-controls">
              {/* Size Selection */}
              <div style={styles.optionGroup}>
                <label style={styles.label}>المقاس:</label>
                <div style={styles.optionsContainer} className="options-container sizes-container">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        ...styles.optionButton,
                        ...(selectedSize === size ? styles.optionButtonActive : {})
                      }}
                    >
                      {size}
                      <span style={styles.stockInfo}>
                        ({product.sizes[size]} متوفر)
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div style={styles.optionGroup}>
                <label style={styles.label}>اللون:</label>
                <div style={styles.optionsContainer} className="options-container colors-container">
                  {product.colors && product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        ...styles.optionButton,
                        ...(selectedColor === color ? styles.optionButtonActive : {})
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div style={styles.optionGroup}>
                <label style={styles.label}>الكمية:</label>
                <div style={styles.quantityContainer} className="quantity-container">
                  <button onClick={decrementQuantity} style={styles.quantityButton}>
                    <Minus size={20} />
                  </button>
                  <span style={styles.quantityDisplay} className="quantityDisplay">{quantity}</span>
                  <button onClick={incrementQuantity} style={styles.quantityButton}>
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary"
                  style={styles.addToCartButton}
                  disabled={availableSizes.length === 0}
                >
                  <ShoppingCart size={24} />
                  <span>إضافة إلى السلة</span>
                </button>
              </div>
            </div>
            </>
          )}
          {/* Main Image */}
          <div style={styles.mainImageContainer}>
            <img 
              src={product.images && product.images[selectedImage] || '/placeholder.png'}
              alt={product.name}
              style={styles.mainImage}
              className="main-image"
            />
            {hasDiscount && (
              <div style={styles.discountBadge}>تخفيض</div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={styles.thumbnails} className="thumbnails">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  style={{
                    ...styles.thumbnail,
                    ...(selectedImage === index ? styles.thumbnailActive : {})
                  }}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

  {/* Details Section */}
  <div style={styles.detailsSection} className="details-section">
          <h1 style={styles.title}>{product.name}</h1>
          
          {/* Category */}
          <div style={{ marginBottom: '1rem' }}>
            <span className="badge badge-primary">{product.category}</span>
          </div>

          {/* Price */}
          <div style={styles.priceContainer}>
            <span style={styles.price}>{formatPrice(displayPrice)}</span>
            {hasDiscount && (
              <span style={styles.oldPrice}>{formatPrice(product.sellPrice)}</span>
            )}
          </div>

          {/* Description */}
          <p style={styles.description}>{product.description}</p>

          {/* Size Selection */}
          <div style={styles.optionGroup}>
            <label style={styles.label}>المقاس:</label>
            <div style={styles.optionsContainer} className="options-container sizes-container">
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    ...styles.optionButton,
                    ...(selectedSize === size ? styles.optionButtonActive : {})
                  }}
                >
                  {size}
                  <span style={styles.stockInfo}>
                    ({product.sizes[size]} متوفر)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div style={styles.optionGroup}>
            <label style={styles.label}>اللون:</label>
            <div style={styles.optionsContainer} className="options-container colors-container">
              {product.colors && product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    ...styles.optionButton,
                    ...(selectedColor === color ? styles.optionButtonActive : {})
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div style={styles.optionGroup}>
            <label style={styles.label}>الكمية:</label>
            <div style={styles.quantityContainer} className="quantity-container">
              <button onClick={decrementQuantity} style={styles.quantityButton}>
                <Minus size={20} />
              </button>
              <span style={styles.quantityDisplay} className="quantityDisplay">{quantity}</span>
              <button onClick={incrementQuantity} style={styles.quantityButton}>
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className="btn btn-primary"
            style={styles.addToCartButton}
            disabled={availableSizes.length === 0}
          >
            <ShoppingCart size={24} />
            <span>إضافة إلى السلة</span>
          </button>

          {/* Stock Info */}
          <div style={styles.stockInfo}>
            <p style={{ margin: 0 }}>
              الكمية المتوفرة: {product.totalQuantity} قطعة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem 0'
  },
  successMessage: {
    position: 'fixed',
    top: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    minWidth: '300px'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  imagesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  mainImageContainer: {
    position: 'relative',
    width: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: 'var(--background-color)'
  },
  mainImage: {
    width: '100%',
    height: '500px',
    objectFit: 'cover'
  },
  discountBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'var(--error-color)',
    color: 'var(--secondary-color)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '1rem',
    fontWeight: 700
  },
  thumbnails: {
    display: 'flex',
    gap: '1rem',
    overflowX: 'auto'
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '2px solid var(--border-color)',
    transition: 'border-color 0.3s ease'
  },
  thumbnailActive: {
    borderColor: 'var(--primary-color)'
  },
  detailsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  price: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--primary-color)'
  },
  oldPrice: {
    fontSize: '1.5rem',
    color: 'var(--text-light)',
    textDecoration: 'line-through'
  },
  description: {
    fontSize: '1.125rem',
    lineHeight: 1.6,
    color: 'var(--text-light)'
  },
  optionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  label: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--text-color)'
  },
  optionsContainer: {
    /* layout handled via CSS; keep this empty so mobile/desktop CSS can control wrapping */
  },
  
  optionButton: {
    padding: '0.75rem 1.5rem',
    border: '2px solid var(--border-color)',
    borderRadius: '8px',
    backgroundColor: 'var(--secondary-color)',
    color: 'var(--text-color)',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'Cairo, sans-serif'
  },
  optionButtonActive: {
    borderColor: 'var(--primary-color)',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)'
  },
  stockInfo: {
    fontSize: '0.75rem',
    marginRight: '0.5rem',
    opacity: 0.8
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  quantityButton: {
    width: '48px',
    height: '48px',
    border: '2px solid var(--primary-color)',
    borderRadius: '8px',
    backgroundColor: 'var(--secondary-color)',
    color: 'var(--primary-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  quantityDisplay: {
    fontSize: '1.5rem',
    fontWeight: 700,
    minWidth: '60px',
    textAlign: 'center'
  },
  addToCartButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '1rem',
    fontSize: '1.125rem',
    marginTop: '1rem'
  }
};

// Responsive styles

export default ProductDetails;