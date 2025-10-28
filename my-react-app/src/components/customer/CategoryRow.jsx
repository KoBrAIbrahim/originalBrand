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
    <section style={styles.section} className="category-section">
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>{category}</h2>
          <Link 
            to={`/category/${category}`} 
            style={styles.viewAllLink}
            className="view-all-link"
          >
            عرض الكل
            <ChevronLeft size={20} />
          </Link>
        </div>

        {/* Products Slider */}
        <div style={styles.sliderContainer}>
          {/* Scroll Buttons - Desktop Only */}
          {products.length > 3 && (
            <>
              <button 
                style={{...styles.scrollButton, ...styles.scrollButtonRight}}
                onClick={() => scroll('right')}
                aria-label="التالي"
                className="scroll-btn scroll-btn-right"
              >
                <ChevronRight size={24} />
              </button>
              <button 
                style={{...styles.scrollButton, ...styles.scrollButtonLeft}}
                onClick={() => scroll('left')}
                aria-label="السابق"
                className="scroll-btn scroll-btn-left"
              >
                <ChevronLeft size={24} />
              </button>
            </>
          )}

          {/* Products */}
          <div 
            ref={scrollContainerRef}
            style={styles.productsContainer}
            className="products-container"
          >
            {products.map(product => (
              <div key={product.id} style={styles.productWrapper} className="product-wrapper">
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

// Custom scrollbar and mobile styles
const customStyles = `
  /* Scrollbar styles */
  .products-container::-webkit-scrollbar {
    height: 8px;
  }
  .products-container::-webkit-scrollbar-track {
    background: var(--border-color);
    border-radius: 10px;
  }
  .products-container::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 10px;
  }
  .products-container::-webkit-scrollbar-thumb:hover {
    background: #1a4529;
  }

  /* Mobile Styles */
  @media (max-width: 768px) {
    .category-section {
      padding: 2rem 0 !important;
    }

    .category-section h2 {
      font-size: 1.5rem !important;
      padding: 0 1rem;
    }

    .category-section .container {
      padding: 0 !important;
    }

    .category-section .view-all-link {
      font-size: 1rem !important;
      padding-right: 1rem;
    }

    /* Hide scroll buttons on mobile */
    .scroll-btn {
      display: none !important;
    }

    /* Products container mobile */
    .products-container {
      gap: 0.75rem !important;
      padding: 0 1rem 1rem 1rem !important;
      scroll-snap-type: x mandatory;
    }

    /* Product wrapper mobile */
    .product-wrapper {
      min-width: 160px !important;
      max-width: 160px !important;
      scroll-snap-align: start;
    }

    /* Add black border to ProductCard on mobile */
    .product-wrapper > div {
      border: 2px solid #000 !important;
      border-radius: 8px !important;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    }

    /* Reduce ProductCard padding on mobile */
    .product-wrapper .product-card {
      padding: 0.5rem !important;
    }

    /* Smaller text in ProductCard */
    .product-wrapper h3 {
      font-size: 0.875rem !important;
      margin-bottom: 0.25rem !important;
    }

    .product-wrapper .price {
      font-size: 1rem !important;
    }

    /* Scrollbar mobile */
    .products-container::-webkit-scrollbar {
      height: 4px;
    }
  }

  @media (max-width: 480px) {
    .category-section {
      padding: 1.5rem 0 !important;
    }

    .category-section h2 {
      font-size: 1.25rem !important;
      padding: 0 0.75rem;
    }

    .products-container {
      gap: 0.5rem !important;
      padding: 0 0.75rem 0.75rem 0.75rem !important;
    }

    .product-wrapper {
      min-width: 200px !important;
      max-width: 200px !important;
    }

    /* Thinner border on very small screens */
    .product-wrapper > div {
      border-width: 1.5px !important;
      border-radius: 6px !important;
    }

    /* Even smaller text */
    .product-wrapper h3 {
      font-size: 0.75rem !important;
      line-height: 1.2 !important;
    }

    .product-wrapper .price {
      font-size: 0.875rem !important;
      font-weight: 600 !important;
    }

    .view-all-link {
      font-size: 0.875rem !important;
      padding-right: 0.75rem;
    }
  }

  /* Extra small screens */
  @media (max-width: 380px) {
    .product-wrapper {
      min-width: 120px !important;
      max-width: 120px !important;
    }

    .products-container {
      gap: 0.375rem !important;
      padding: 0 0.5rem 0.5rem 0.5rem !important;
    }

    .product-wrapper > div {
      border-width: 1px !important;
    }
  }

  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .products-container {
      -webkit-overflow-scrolling: touch;
      scroll-snap-type: x mandatory;
    }

    .product-wrapper {
      scroll-snap-align: start;
    }

    /* Better touch targets */
    .view-all-link {
      padding: 0.5rem;
      margin: -0.5rem;
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  if (!document.head.querySelector('style[data-category-row-mobile]')) {
    styleSheet.setAttribute('data-category-row-mobile', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default CategoryRow;