import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { CATEGORIES } from '../../utils/constants';
import CategoryRow from '../../components/customer/CategoryRow';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const HomePage = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <Loading message="جاري تحميل المنتجات..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // تجميع المنتجات حسب الفئة
  const productsByCategory = CATEGORIES.map(category => ({
    category,
    products: products.filter(p => p.category === category).slice(0, 10)
  })).filter(item => item.products.length > 0);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container">
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>مرحباً بك في Original Brand</h1>
            <p style={styles.heroSubtitle}>
              أفضل الملابس والأحذية الأصلية بأسعار منافسة
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      {productsByCategory.length > 0 ? (
        productsByCategory.map(({ category, products }) => (
          <CategoryRow 
            key={category}
            category={category}
            products={products}
          />
        ))
      ) : (
        <div style={styles.empty}>
          <p>لا توجد منتجات متاحة حالياً</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 200px)'
  },
  hero: {
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    padding: '4rem 0',
    marginBottom: '2rem'
  },
  heroContent: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 700,
    marginBottom: '1rem',
    lineHeight: 1.2
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    opacity: 0.9,
    lineHeight: 1.6
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: 'var(--text-light)',
    fontSize: '1.25rem'
  }
};

// Responsive styles
const mediaStyles = `
  @media (max-width: 768px) {
    .heroTitle {
      font-size: 2rem !important;
    }
    .heroSubtitle {
      font-size: 1.125rem !important;
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mediaStyles;
  if (!document.head.querySelector('style[data-home-page]')) {
    styleSheet.setAttribute('data-home-page', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default HomePage;