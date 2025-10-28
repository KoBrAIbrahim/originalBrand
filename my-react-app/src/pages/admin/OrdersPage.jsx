import React, { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import OrderCard from '../../components/admin/OrderCard';
import EditOrderDialog from '../../components/admin/EditOrderDialog';
import AdminDialog from '../../components/common/AdminDialog';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { ORDER_STATUS } from '../../utils/constants';

const OrdersPage = () => {
  const { orders, loading, error, changeOrderStatus, updateExistingOrder } = useOrders();
  const [filterStatus, setFilterStatus] = useState('all');

  const handleAccept = async (orderId) => {
    try {
      await changeOrderStatus(orderId, ORDER_STATUS.ACCEPTED);
    } catch (error) {
      setErrorDialog({ open: true, message: error.message || 'حدث خطأ أثناء قبول الطلب' });
    }
  };

  const handleReject = async (orderId) => {
    try {
      await changeOrderStatus(orderId, ORDER_STATUS.REJECTED);
    } catch (error) {
      setErrorDialog({ open: true, message: error.message || 'حدث خطأ أثناء رفض الطلب' });
    }
  };

  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
  const [editDialog, setEditDialog] = useState({ open: false, order: null });

  if (loading) {
    return <Loading message="جاري تحميل الطلبات..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // فلترة الطلبات حسب الحالة
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // إحصائيات
  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === ORDER_STATUS.PENDING).length,
    accepted: orders.filter(o => o.status === ORDER_STATUS.ACCEPTED).length,
    rejected: orders.filter(o => o.status === ORDER_STATUS.REJECTED).length
  };

  return (
    <div style={styles.container} className="admin-page">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>إدارة الطلبات</h1>
          <p style={styles.subtitle}>
            {filteredOrders.length} {filteredOrders.length === 1 ? 'طلب' : 'طلبات'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <button
          onClick={() => setFilterStatus('all')}
          style={{
            ...styles.filterButton,
            ...(filterStatus === 'all' ? styles.filterButtonActive : {})
          }}
        >
          الكل ({stats.all})
        </button>
        <button
          onClick={() => setFilterStatus(ORDER_STATUS.PENDING)}
          style={{
            ...styles.filterButton,
            ...(filterStatus === ORDER_STATUS.PENDING ? styles.filterButtonActive : {})
          }}
        >
          قيد المراجعة ({stats.pending})
        </button>
        <button
          onClick={() => setFilterStatus(ORDER_STATUS.ACCEPTED)}
          style={{
            ...styles.filterButton,
            ...(filterStatus === ORDER_STATUS.ACCEPTED ? styles.filterButtonActive : {})
          }}
        >
          مقبول ({stats.accepted})
        </button>
        <button
          onClick={() => setFilterStatus(ORDER_STATUS.REJECTED)}
          style={{
            ...styles.filterButton,
            ...(filterStatus === ORDER_STATUS.REJECTED ? styles.filterButtonActive : {})
          }}
        >
          مرفوض ({stats.rejected})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div style={styles.ordersGrid} className="ordersGrid">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={handleAccept}
              onReject={handleReject}
              onEdit={(o) => setEditDialog({ open: true, order: o })}
            />
          ))}
        </div>
      ) : (
        <div style={styles.empty}>
          <p>لا توجد طلبات 
            {filterStatus !== 'all' && (
              filterStatus === ORDER_STATUS.PENDING ? ' قيد المراجعة' :
              filterStatus === ORDER_STATUS.ACCEPTED ? ' مقبولة' :
              ' مرفوضة'
            )}
          </p>
        </div>
      )}
      <AdminDialog
        open={errorDialog.open}
        title="حدث خطأ"
        onConfirm={() => setErrorDialog({ open: false, message: '' })}
        onCancel={() => setErrorDialog({ open: false, message: '' })}
        showCancel={false}
        confirmText="حسناً"
      >
        <p>{errorDialog.message}</p>
      </AdminDialog>
      <EditOrderDialog
        open={editDialog.open}
        order={editDialog.order}
        onClose={() => setEditDialog({ open: false, order: null })}
        onSave={async (orderId, updatedOrder) => {
          try {
            await updateExistingOrder(orderId, updatedOrder);
            setEditDialog({ open: false, order: null });
          } catch (err) {
            setErrorDialog({ open: true, message: err.message || 'فشل تحديث الطلب' });
          }
        }}
      />
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem'
  },
  header: {
    marginBottom: '2rem'
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
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  filterButton: {
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
  filterButtonActive: {
    borderColor: 'var(--primary-color)',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)'
  },
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
    gap: '1.5rem'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '12px',
    color: 'var(--text-light)',
    fontSize: '1.125rem'
  }
};

// Responsive styles
const mediaStyles = `
  @media (max-width: 768px) {
    .ordersGrid {
      grid-template-columns: 1fr !important;
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mediaStyles;
  if (!document.head.querySelector('style[data-orders-page]')) {
    styleSheet.setAttribute('data-orders-page', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default OrdersPage;