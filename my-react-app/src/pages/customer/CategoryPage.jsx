import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/customer/ProductCard';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Search } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams();
  const { products, loading, error } = useProducts(category);
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return <Loading message="جاري تحميل المنتجات..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // فلترة المنتجات بناءً على البحث
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>{category}</h1>
        <p style={styles.subtitle}>
          {products.length} {products.length === 1 ? 'منتج' : 'منتج'}
        </p>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <div style={styles.searchBox}>
          <Search size={20} color="var(--text-light)" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-3" style={{ marginTop: '2rem' }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={styles.empty}>
          <p>
            {searchTerm 
              ? 'لم يتم العثور على منتجات تطابق البحث'
              : 'لا توجد منتجات في هذه الفئة حالياً'
            }
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '2rem',
    paddingBottom: '4rem',
    minHeight: 'calc(100vh - 200px)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.125rem',
    color: 'var(--text-light)'
  },
  searchContainer: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '12px',
    border: '2px solid var(--border-color)',
    boxShadow: 'var(--shadow)'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    fontFamily: 'Cairo, sans-serif',
    backgroundColor: 'transparent'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: 'var(--text-light)',
    fontSize: '1.125rem'
  }
};

export default CategoryPage;