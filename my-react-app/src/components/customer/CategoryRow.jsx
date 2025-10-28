import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const CategoryRow = ({ category, products }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollPosition = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section style={styles.section}>
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>{category}</h2>
          <Link 
            to={`/category/${category}`} 
            style={styles.viewAllLink}
          >
            عرض الكل
            <ChevronLeft size={20} />
          </Link>
        </div>

        {/* Products Slider */}
        <div style={styles.sliderContainer}>
          {/* Scroll Buttons */}
          {products.length > 3 && (
            <>
              <button 
                style={{...styles.scrollButton, ...styles.scrollButtonRight}}
                onClick={() => scroll('right')}
                aria-label="التالي"
              >
                <ChevronRight size={24} />
              </button>
              <button 
                style={{...styles.scrollButton, ...styles.scrollButtonLeft}}
                onClick={() => scroll('left')}
                aria-label="السابق"
              >
                <ChevronLeft size={24} />
              </button>
            </>
          )}

          {/* Products */}
          <div 
            ref={scrollContainerRef}
            style={styles.productsContainer}
          >
            {products.map(product => (
              <div key={product.id} style={styles.productWrapper}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '3rem 0'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0
  },
  viewAllLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--primary-color)',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1.125rem',
    transition: 'gap 0.3s ease'
  },
  sliderContainer: {
    position: 'relative'
  },
  productsContainer: {
    display: 'flex',
    gap: '1.5rem',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    paddingBottom: '1rem',
    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--primary-color) var(--border-color)'
  },
  productWrapper: {
    minWidth: '280px',
    flexShrink: 0
  },
  scrollButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '48px',
    height: '48px',
    backgroundColor: 'var(--secondary-color)',
    border: '2px solid var(--primary-color)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    color: 'var(--primary-color)',
    boxShadow: 'var(--shadow)',
    transition: 'all 0.3s ease'
  },
  scrollButtonRight: {
    right: '-24px'
  },
  scrollButtonLeft: {
    left: '-24px'
  }
};

// Custom scrollbar styles
const scrollbarStyles = `
  .productsContainer::-webkit-scrollbar {
    height: 8px;
  }
  .productsContainer::-webkit-scrollbar-track {
    background: var(--border-color);
    border-radius: 10px;
  }
  .productsContainer::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 10px;
  }
  .productsContainer::-webkit-scrollbar-thumb:hover {
    background: #1a4529;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = scrollbarStyles;
  if (!document.head.querySelector('style[data-scrollbar]')) {
    styleSheet.setAttribute('data-scrollbar', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default CategoryRow;