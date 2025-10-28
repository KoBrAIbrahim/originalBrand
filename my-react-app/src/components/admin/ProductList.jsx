import React, { useState } from 'react';
import AdminDialog from '../common/AdminDialog';
import { Edit, Trash2, Tag } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import SaleForm from './SaleForm';

const ProductList = ({ products, onEdit, onDelete, onAddSale }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSaleForm, setShowSaleForm] = useState(false);

  const handleSaleClick = (product) => {
    setSelectedProduct(product);
    setShowSaleForm(true);
  };

  const handleSaleSubmit = async (salePrice) => {
    await onAddSale(selectedProduct.id, salePrice);
    setShowSaleForm(false);
    setSelectedProduct(null);
  };

  const handleDelete = (product) => {
    // open confirmation dialog
    setConfirmState({ open: true, message: `هل تريد حذف "${product.name}"؟`, onConfirm: () => onDelete(product.id) });
  };

  const [confirmState, setConfirmState] = useState({ open: false, message: '', onConfirm: null });

  if (!products || products.length === 0) {
    return (
      <div style={styles.empty}>
        <p>لا توجد منتجات حالياً</p>
      </div>
    );
  }

  return (
    <>
      <div style={styles.grid} className="admin-product-grid">
        {products.map(product => (
          <div key={product.id} style={styles.card}>
            {/* Image */}
            <div style={styles.imageContainer}>
              <img
                src={product.images && product.images[0] || '/placeholder.png'}
                alt={product.name}
                style={styles.image}
              />
              {product.salePrice && (
                <div style={styles.saleBadge}>تخفيض</div>
              )}
            </div>

            {/* Info */}
            <div style={styles.info}>
              <h3 style={styles.name}>{product.name}</h3>
              <p style={styles.category}>{product.category}</p>
              
              <div style={styles.priceContainer}>
                <div>
                  <span style={styles.priceLabel}>سعر البيع:</span>
                  <span style={styles.price}>{formatPrice(product.sellPrice)}</span>
                </div>
                {product.salePrice && (
                  <div>
                    <span style={styles.priceLabel}>سعر التخفيض:</span>
                    <span style={styles.salePrice}>{formatPrice(product.salePrice)}</span>
                  </div>
                )}
              </div>

              <div style={styles.stats}>
                <span style={styles.stat}>الكمية: {product.totalQuantity}</span>
                <span style={styles.stat}>الألوان: {product.colors?.length || 0}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button
                onClick={() => handleSaleClick(product)}
                style={styles.actionButton}
                title="إضافة تخفيض"
              >
                <Tag size={18} />
              </button>
              <button
                onClick={() => onEdit(product)}
                style={{...styles.actionButton, backgroundColor: 'var(--primary-color)'}}
                title="تعديل"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(product)}
                style={{...styles.actionButton, backgroundColor: 'var(--error-color)'}}
                title="حذف"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sale Form Modal */}
      {showSaleForm && selectedProduct && (
        <SaleForm
          product={selectedProduct}
          onSubmit={handleSaleSubmit}
          onCancel={() => {
            setShowSaleForm(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Confirmation dialog for deletions */}
      <AdminDialog
        open={confirmState.open}
        title="تأكيد الحذف"
        onConfirm={() => {
          if (confirmState.onConfirm) confirmState.onConfirm();
          setConfirmState({ open: false, message: '', onConfirm: null });
        }}
        onCancel={() => setConfirmState({ open: false, message: '', onConfirm: null })}
        confirmText="حذف"
        cancelText="إلغاء"
        showCancel={true}
      >
        <p>{confirmState.message}</p>
      </AdminDialog>
    </>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    transition: 'transform 0.3s ease'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    backgroundColor: 'var(--background-color)'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  saleBadge: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    backgroundColor: 'var(--error-color)',
    color: 'var(--secondary-color)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 700
  },
  info: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  name: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0
  },
  category: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: 600,
    alignSelf: 'flex-start'
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid var(--border-color)'
  },
  priceLabel: {
    fontSize: '0.875rem',
    color: 'var(--text-light)',
    marginLeft: '0.5rem'
  },
  price: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--primary-color)'
  },
  salePrice: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--error-color)'
  },
  stats: {
    display: 'flex',
    gap: '1rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid var(--border-color)'
  },
  stat: {
    fontSize: '0.875rem',
    color: 'var(--text-light)'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    borderTop: '1px solid var(--border-color)',
    backgroundColor: 'var(--background-color)'
  },
  actionButton: {
    flex: 1,
    padding: '0.75rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'var(--warning-color)',
    color: 'var(--secondary-color)',
    cursor: 'pointer',
    transition: 'opacity 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--text-light)',
    fontSize: '1.125rem'
  }
};

export default ProductList;