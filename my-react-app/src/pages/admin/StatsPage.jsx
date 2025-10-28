import React, { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice, formatDate, filterOrdersByDate } from '../../utils/helpers';
import { BarChart3, TrendingUp, Package, DollarSign } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';

const StatsPage = () => {
  const { orders, loading: ordersLoading, error: ordersError } = useOrders();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const [dateFilter, setDateFilter] = useState('all');

  const loading = ordersLoading || productsLoading;
  const error = ordersError || productsError;

  if (loading) {
    return <Loading message="جاري تحميل الإحصائيات..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // فلترة الطلبات حسب التاريخ
  const filteredOrders = filterOrdersByDate(orders, dateFilter);
  const acceptedOrders = filteredOrders.filter(o => o.status === 'accepted');

  // حساب الإحصائيات
  const totalRevenue = acceptedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = filteredOrders.length;
  const acceptedOrdersCount = acceptedOrders.length;
  const avgOrderValue = acceptedOrdersCount > 0 ? totalRevenue / acceptedOrdersCount : 0;

  // أكثر المنتجات مبيعاً
  const productSales = {};
  acceptedOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          name: item.productName,
          quantity: 0,
          revenue: 0
        };
      }
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
    });
  });

  const topProducts = Object.entries(productSales)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // أحدث الطلبات
  const recentOrders = [...filteredOrders]
    .sort((a, b) => {
      const dateA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div style={styles.container} className="admin-page">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>الإحصائيات والتحليلات</h1>
          <p style={styles.subtitle}>نظرة تفصيلية على أداء المتجر</p>
        </div>
      </div>

      {/* Date Filter */}
      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>الفترة الزمنية:</label>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="form-select"
          style={styles.filterSelect}
        >
          <option value="all">كل الوقت</option>
          <option value="today">اليوم</option>
          <option value="week">آخر 7 أيام</option>
          <option value="month">هذا الشهر</option>
        </select>
      </div>

      {/* Stats Cards */}
  <div style={styles.statsGrid} className="statsGrid">
        <StatsCard
          title="إجمالي المبيعات"
          value={formatPrice(totalRevenue)}
          icon={DollarSign}
          color="var(--success-color)"
        />
        <StatsCard
          title="عدد الطلبات"
          value={totalOrders}
          icon={BarChart3}
          color="var(--primary-color)"
        />
        <StatsCard
          title="الطلبات المقبولة"
          value={acceptedOrdersCount}
          icon={TrendingUp}
          color="var(--success-color)"
        />
        <StatsCard
          title="متوسط قيمة الطلب"
          value={formatPrice(avgOrderValue)}
          icon={Package}
          color="var(--warning-color)"
        />
      </div>

      {/* Two Columns Layout */}
  <div style={styles.twoColumns} className="twoColumns">
        {/* Top Products */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>أكثر المنتجات مبيعاً</h2>
          {topProducts.length > 0 ? (
            <div style={styles.list}>
              {topProducts.map((product, index) => (
                <div key={product.id} style={styles.listItem}>
                  <div style={styles.productRank}>#{index + 1}</div>
                  <div style={styles.productInfo}>
                    <h4 style={styles.productName}>{product.name}</h4>
                    <div style={styles.productStats}>
                      <span>الكمية: {product.quantity}</span>
                      <span>الإيرادات: {formatPrice(product.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.emptyText}>لا توجد مبيعات في هذه الفترة</p>
          )}
        </div>

        {/* Recent Orders */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>أحدث الطلبات</h2>
          {recentOrders.length > 0 ? (
            <div style={styles.list}>
              {recentOrders.map((order) => (
                <div key={order.id} style={styles.listItem}>
                  <div style={styles.orderInfo}>
                    <h4 style={styles.orderCustomer}>{order.customerName}</h4>
                    <p style={styles.orderDate}>{formatDate(order.createdAt)}</p>
                  </div>
                  <div style={styles.orderPrice}>
                    {formatPrice(order.totalPrice)}
                  </div>
                  <span className={`badge badge-${
                    order.status === 'pending' ? 'warning' :
                    order.status === 'accepted' ? 'success' : 'danger'
                  }`}>
                    {order.status === 'pending' ? 'قيد المراجعة' :
                     order.status === 'accepted' ? 'مقبول' : 'مرفوض'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.emptyText}>لا توجد طلبات في هذه الفترة</p>
          )}
        </div>
      </div>

      {/* Products Summary */}
      <div style={styles.productsSummary}>
        <h2 style={styles.sectionTitle}>ملخص المنتجات</h2>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <Package size={32} color="var(--primary-color)" />
            <div>
              <p style={styles.summaryLabel}>إجمالي المنتجات</p>
              <p style={styles.summaryValue}>{products.length}</p>
            </div>
          </div>
          <div style={styles.summaryCard}>
            <TrendingUp size={32} color="var(--success-color)" />
            <div>
              <p style={styles.summaryLabel}>المخزون الكلي</p>
              <p style={styles.summaryValue}>
                {products.reduce((sum, p) => sum + (p.totalQuantity || 0), 0)}
              </p>
            </div>
          </div>
          <div style={styles.summaryCard}>
            <BarChart3 size={32} color="var(--warning-color)" />
            <div>
              <p style={styles.summaryLabel}>منتجات بها تخفيضات</p>
              <p style={styles.summaryValue}>
                {products.filter(p => p.salePrice).length}
              </p>
            </div>
          </div>
        </div>
      </div>
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
  filterSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  filterLabel: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-color)'
  },
  filterSelect: {
    minWidth: '200px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  },
  twoColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '3rem'
  },
  section: {
    backgroundColor: 'var(--secondary-color)',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    marginBottom: '1.5rem'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'var(--background-color)',
    borderRadius: '8px'
  },
  productRank: {
    width: '40px',
    height: '40px',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.125rem'
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-color)',
    margin: '0 0 0.5rem 0'
  },
  productStats: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
    color: 'var(--text-light)'
  },
  orderInfo: {
    flex: 1
  },
  orderCustomer: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-color)',
    margin: '0 0 0.25rem 0'
  },
  orderDate: {
    fontSize: '0.875rem',
    color: 'var(--text-light)',
    margin: 0
  },
  orderPrice: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--primary-color)',
    marginLeft: '1rem'
  },
  emptyText: {
    textAlign: 'center',
    padding: '2rem',
    color: 'var(--text-light)',
    fontSize: '1rem'
  },
  productsSummary: {
    backgroundColor: 'var(--secondary-color)',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: 'var(--background-color)',
    borderRadius: '8px'
  },
  summaryLabel: {
    fontSize: '0.9375rem',
    color: 'var(--text-light)',
    margin: '0 0 0.5rem 0'
  },
  summaryValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0
  }
};

// Responsive styles
const mediaStyles = `
  @media (max-width: 1024px) {
    .twoColumns {
      grid-template-columns: 1fr !important;
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mediaStyles;
  if (!document.head.querySelector('style[data-stats-page]')) {
    styleSheet.setAttribute('data-stats-page', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default StatsPage;