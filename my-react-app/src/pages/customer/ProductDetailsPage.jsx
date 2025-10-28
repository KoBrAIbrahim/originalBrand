import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import ProductDetails from '../../components/customer/ProductDetails';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { ChevronRight } from 'lucide-react';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);

  if (loading) {
    return <Loading message="جاري تحميل المنتج..." />;
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <ErrorMessage message={error} />
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn btn-primary">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <ErrorMessage message="المنتج غير موجود" />
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn btn-primary">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={styles.container}>
      {/* Breadcrumb */}
      <nav style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>
          الرئيسية
        </Link>
        <ChevronRight size={16} style={{ color: 'var(--text-light)' }} />
        <Link 
          to={`/category/${product.category}`} 
          style={styles.breadcrumbLink}
        >
          {product.category}
        </Link>
        <ChevronRight size={16} style={{ color: 'var(--text-light)' }} />
        <span style={styles.breadcrumbCurrent}>{product.name}</span>
      </nav>

      {/* Product Details */}
      <ProductDetails product={product} />
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '2rem',
    paddingBottom: '4rem',
    minHeight: 'calc(100vh - 200px)'
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
    padding: '0.75rem 0',
    fontSize: '0.9375rem'
  },
  breadcrumbLink: {
    color: 'var(--primary-color)',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'opacity 0.3s ease'
  },
  breadcrumbCurrent: {
    color: 'var(--text-light)',
    fontWeight: 600
  }
};

export default ProductDetailsPage;