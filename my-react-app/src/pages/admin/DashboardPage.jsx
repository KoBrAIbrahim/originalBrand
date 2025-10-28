import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Clock, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useOrdersStats } from '../../hooks/useOrders';
import StatsCard from '../../components/admin/StatsCard';
import Loading from '../../components/common/Loading';
import { formatPrice } from '../../utils/helpers';

const DashboardPage = () => {
  const { products, loading: productsLoading } = useProducts();
  const { stats, loading: statsLoading } = useOrdersStats();

  const loading = productsLoading || statsLoading;

  if (loading) {
    return <Loading message="جاري تحميل لوحة التحكم..." />;
  }

  const totalProducts = products?.length || 0;
  const totalStock = products?.reduce((sum, p) => sum + (p.totalQuantity || 0), 0) || 0;

  return (
    <div style={styles.container} className="admin-page">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>لوحة التحكم</h1>
          <p style={styles.subtitle}>نظرة عامة على المتجر</p>
        </div>
      </div>

      {/* Stats Grid */}
  <div style={styles.statsGrid} className="statsGrid">
        <StatsCard
          title="إجمالي الطلبات"
          value={stats?.total || 0}
          icon={ShoppingBag}
          color="var(--primary-color)"
        />
        <StatsCard
          title="طلبات قيد المراجعة"
          value={stats?.pending || 0}
          icon={Clock}
          color="var(--warning-color)"
        />
        <StatsCard
          title="طلبات مقبولة"
          value={stats?.accepted || 0}
          icon={CheckCircle}
          color="var(--success-color)"
        />
        <StatsCard
          title="إجمالي المبيعات"
          value={formatPrice(stats?.totalRevenue || 0)}
          icon={DollarSign}
          color="var(--primary-color)"
        />
        <StatsCard
          title="عدد المنتجات"
          value={totalProducts}
          icon={Package}
          color="#9C27B0"
        />
        <StatsCard
          title="المخزون الكلي"
          value={totalStock}
          icon={TrendingUp}
          color="#FF9800"
        />
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>إجراءات سريعة</h2>
        <div style={styles.actionsGrid} className="actionsGrid">
          <Link to="/admin/products" style={styles.actionCard} className="actionCard">
            <Package size={32} color="var(--primary-color)" />
            <h3 style={styles.actionTitle}>إدارة المنتجات</h3>
            <p style={styles.actionDescription}>
              إضافة، تعديل، أو حذف المنتجات
            </p>
          </Link>

          <Link to="/admin/orders" style={styles.actionCard} className="actionCard">
            <ShoppingBag size={32} color="var(--warning-color)" />
            <h3 style={styles.actionTitle}>إدارة الطلبات</h3>
            <p style={styles.actionDescription}>
              مراجعة وقبول أو رفض الطلبات
            </p>
          </Link>

          <Link to="/admin/stats" style={styles.actionCard} className="actionCard">
            <TrendingUp size={32} color="var(--success-color)" />
            <h3 style={styles.actionTitle}>الإحصائيات</h3>
            <p style={styles.actionDescription}>
              عرض تفاصيل المبيعات والطلبات
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {stats && stats.pending > 0 && (
        <div className="alert alert-warning" style={{ marginTop: '2rem' }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '1.125rem' }}>
            ⚠️ لديك {stats.pending} {stats.pending === 1 ? 'طلب' : 'طلبات'} جديدة بانتظار المراجعة
          </p>
          <Link 
            to="/admin/orders" 
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            عرض الطلبات
          </Link>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem'
  },
  header: {
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  },
  quickActions: {
    marginTop: '3rem'
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    marginBottom: '1.5rem'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  actionCard: {
    backgroundColor: 'var(--secondary-color)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
    transition: 'all 0.3s ease',
    border: '2px solid transparent'
  },
  actionTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0
  },
  actionDescription: {
    fontSize: '0.9375rem',
    color: 'var(--text-light)',
    margin: 0,
    lineHeight: 1.5
  }
};

// Hover effect
const styleSheet = `
  .actionCard:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: var(--primary-color);
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = styleSheet;
  if (!document.head.querySelector('style[data-dashboard]')) {
    style.setAttribute('data-dashboard', 'true');
    document.head.appendChild(style);
  }
}

export default DashboardPage;