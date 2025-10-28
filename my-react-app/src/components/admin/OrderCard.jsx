import React, { useState } from 'react';
import AdminDialog from '../common/AdminDialog';
import { Check, X, User, MapPin, Phone, Package } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/helpers';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../utils/constants';

const OrderCard = ({ order, onAccept, onReject, onEdit }) => {
  const getStatusBadge = () => {
    switch (order.status) {
      case ORDER_STATUS.PENDING:
        return <span className="badge badge-warning">{ORDER_STATUS_LABELS.pending}</span>;
      case ORDER_STATUS.ACCEPTED:
        return <span className="badge badge-success">{ORDER_STATUS_LABELS.accepted}</span>;
      case ORDER_STATUS.REJECTED:
        return <span className="badge badge-danger">{ORDER_STATUS_LABELS.rejected}</span>;
      default:
        return null;
    }
  };

  const handleAccept = () => {
    setConfirm({ open: true, message: 'هل تريد قبول هذا الطلب؟', action: 'accept' });
  };

  const handleReject = () => {
    setConfirm({ open: true, message: 'هل تريد رفض هذا الطلب؟', action: 'reject' });
  };

  const [confirm, setConfirm] = useState({ open: false, message: '', action: null });

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h3 style={styles.orderId}>طلب #{order.id.slice(-6)}</h3>
          <p style={styles.date}>{formatDate(order.createdAt)}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Customer Info */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>معلومات العميل</h4>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <User size={18} style={{ color: 'var(--primary-color)' }} />
            <span>{order.customerName}</span>
          </div>
          <div style={styles.infoItem}>
            <Phone size={18} style={{ color: 'var(--primary-color)' }} />
            <a href={`https://wa.me/970${order.whatsapp.slice(1)}`} target="_blank" rel="noopener noreferrer" style={styles.whatsappLink}>
              {order.whatsapp}
            </a>
          </div>
          <div style={styles.infoItem}>
            <MapPin size={18} style={{ color: 'var(--primary-color)' }} />
            <span>{order.city} - {order.town}</span>
          </div>
        </div>
        <div style={styles.address}>
          <p style={styles.addressLabel}>العنوان الكامل:</p>
          <p style={styles.addressText}>{order.fullAddress}</p>
        </div>
      </div>

      {/* Order Items */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>
          <Package size={18} style={{ marginLeft: '0.5rem' }} />
          المنتجات ({order.items.length})
        </h4>
        <div style={styles.items}>
          {order.items.map((item, index) => (
            <div key={index} style={styles.item}>
              <div style={styles.itemInfo}>
                <span style={styles.itemName}>{item.productName}</span>
                <div style={styles.itemDetails}>
                  <span>المقاس: {item.size}</span>
                  <span>اللون: {item.color}</span>
                  <span>الكمية: {item.quantity}</span>
                </div>
              </div>
              <span style={styles.itemPrice}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div style={styles.total}>
        <span style={styles.totalLabel}>الإجمالي:</span>
        <span style={styles.totalPrice}>{formatPrice(order.totalPrice)}</span>
      </div>

      {/* Actions */}
      {order.status === ORDER_STATUS.PENDING && (
        <div style={styles.actions}>
          <button
            onClick={() => onEdit && onEdit(order)}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            <span>تعديل</span>
          </button>
          <button
            onClick={handleReject}
            className="btn btn-danger"
            style={{ flex: 1 }}
          >
            <X size={20} />
            <span>رفض</span>
          </button>
          <button
            onClick={handleAccept}
            className="btn btn-success"
            style={{ flex: 1 }}
          >
            <Check size={20} />
            <span>قبول</span>
          </button>
        </div>
      )}
      {/* Edit dialog is opened by parent via onEdit -> OrdersPage */}
        {/* Confirmation dialog */}
        <AdminDialog
          open={confirm.open}
          title="تأكيد الإجراء"
          onConfirm={() => {
            if (confirm.action === 'accept') onAccept(order.id);
            if (confirm.action === 'reject') onReject(order.id);
            setConfirm({ open: false, message: '', action: null });
          }}
          onCancel={() => setConfirm({ open: false, message: '', action: null })}
          confirmText={confirm.action === 'accept' ? 'قبول' : 'رفض'}
          cancelText="إلغاء"
        >
          <p>{confirm.message}</p>
        </AdminDialog>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-color)'
  },
  orderId: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: '0 0 0.25rem 0'
  },
  date: {
    fontSize: '0.875rem',
    color: 'var(--text-light)',
    margin: 0
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0,
    display: 'flex',
    alignItems: 'center'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.75rem'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: 'var(--background-color)',
    borderRadius: '8px',
    fontSize: '0.9375rem'
  },
  whatsappLink: {
    color: 'var(--primary-color)',
    textDecoration: 'none',
    fontWeight: 600
  },
  address: {
    padding: '1rem',
    backgroundColor: 'var(--background-color)',
    borderRadius: '8px'
  },
  addressLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-color)',
    margin: '0 0 0.5rem 0'
  },
  addressText: {
    fontSize: '0.9375rem',
    color: 'var(--text-light)',
    margin: 0,
    lineHeight: 1.5
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'var(--background-color)',
    borderRadius: '8px'
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  itemName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-color)'
  },
  itemDetails: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
    color: 'var(--text-light)'
  },
  itemPrice: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--primary-color)'
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'var(--primary-color)',
    borderRadius: '8px',
    color: 'var(--secondary-color)'
  },
  totalLabel: {
    fontSize: '1.125rem',
    fontWeight: 700
  },
  totalPrice: {
    fontSize: '1.5rem',
    fontWeight: 700
  },
  actions: {
    display: 'flex',
    gap: '1rem'
  }
};

export default OrderCard;