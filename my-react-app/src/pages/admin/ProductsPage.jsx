import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import ProductForm from '../../components/admin/ProductForm';
import ProductList from '../../components/admin/ProductList';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { CATEGORIES } from '../../utils/constants';

const ProductsPage = () => {
  const { 
    products, 
    loading, 
    error, 
    addNewProduct, 
    updateExistingProduct, 
    removeProduct,
    addSale 
  } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleAddClick = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = async (productData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      if (selectedProduct) {
        await updateExistingProduct(selectedProduct.id, productData);
      } else {
        await addNewProduct(productData);
      }
      setShowForm(false);
      setSelectedProduct(null);
    } catch (error) {
      throw error;
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return <Loading message="جاري تحميل المنتجات..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // فلترة المنتجات
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={styles.container} className="admin-page">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>إدارة المنتجات</h1>
          <p style={styles.subtitle}>
            {products.length} {products.length === 1 ? 'منتج' : 'منتج'}
          </p>
        </div>
        <button 
          onClick={handleAddClick}
          className="btn btn-primary"
          style={styles.addButton}
        >
          <Plus size={20} />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {/* Search */}
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

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-select"
          style={styles.categorySelect}
        >
          <option value="all">جميع الفئات</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Products List */}
      <ProductList
        products={filteredProducts}
        onEdit={handleEditClick}
        onDelete={removeProduct}
        onAddSale={addSale}
      />

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={selectedProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem'
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
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0
  },
  subtitle: {
    fontSize: '1.125rem',
    color: 'var(--text-light)',
    margin: '0.5rem 0 0 0'
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.875rem 1.5rem'
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  searchBox: {
    flex: 1,
    minWidth: '300px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1rem',
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '8px',
    border: '2px solid var(--border-color)'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    fontFamily: 'Cairo, sans-serif',
    backgroundColor: 'transparent'
  },
  categorySelect: {
    minWidth: '200px'
  }
};

export default ProductsPage;