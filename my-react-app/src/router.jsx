import React from 'react';
import { createBrowserRouter, Navigate, NavLink } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';

// Layouts
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import CategoryPage from './pages/customer/CategoryPage';
import ProductDetailsPage from './pages/customer/ProductDetailsPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import ContactPage from './pages/customer/ContactPage';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import StatsPage from './pages/admin/StatsPage';

// Customer Layout Component
// eslint-disable-next-line react-refresh/only-export-components
const CustomerLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

// Admin Layout Component
// eslint-disable-next-line react-refresh/only-export-components
const AdminLayout = ({ children }) => {
  const { isAuthenticated, loading, logout } = useAuthContext();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <header className="admin-header">
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <h1 className="admin-title">لوحة التحكم</h1>
      </header>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={toggleSidebar}>×</button>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className="admin-nav-link">
            📊 الرئيسية
          </NavLink>
          <NavLink to="/admin/products" className="admin-nav-link">
            📦 المنتجات
          </NavLink>
          <NavLink to="/admin/orders" className="admin-nav-link">
            🛒 الطلبات
          </NavLink>
          <NavLink to="/admin/stats" className="admin-nav-link">
            📈 الإحصائيات
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={logout} className="admin-logout-button">
            🔒 تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

// Protected Route for Admin
// eslint-disable-next-line react-refresh/only-export-components
const ProtectedAdminRoute = ({ children }) => {
  return <AdminLayout>{children}</AdminLayout>;
};

// Router Configuration
export const router = createBrowserRouter([
  // Customer Routes
  {
    path: '/',
    element: <CustomerLayout><HomePage /></CustomerLayout>
  },
  {
    path: '/category/:category',
    element: <CustomerLayout><CategoryPage /></CustomerLayout>
  },
  {
    path: '/product/:id',
    element: <CustomerLayout><ProductDetailsPage /></CustomerLayout>
  },
  {
    path: '/cart',
    element: <CustomerLayout><CartPage /></CustomerLayout>
  },
  {
    path: '/checkout',
    element: <CustomerLayout><CheckoutPage /></CustomerLayout>
  },
  {
    path: '/contact',
    element: <CustomerLayout><ContactPage /></CustomerLayout>
  },

  // Admin Routes
  {
    path: '/admin/login',
    element: <LoginPage />
  },
  {
    path: '/admin',
    element: <Navigate to="/admin/dashboard" replace />
  },
  {
    path: '/admin/dashboard',
    element: <ProtectedAdminRoute><DashboardPage /></ProtectedAdminRoute>
  },
  {
    path: '/admin/products',
    element: <ProtectedAdminRoute><ProductsPage /></ProtectedAdminRoute>
  },
  {
    path: '/admin/orders',
    element: <ProtectedAdminRoute><OrdersPage /></ProtectedAdminRoute>
  },
  {
    path: '/admin/stats',
    element: <ProtectedAdminRoute><StatsPage /></ProtectedAdminRoute>
  },

  // 404 Not Found
  {
    path: '*',
    element: (
      <CustomerLayout>
        <div style={{
          minHeight: 'calc(100vh - 400px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '4rem', color: 'var(--primary-color)' }}>404</h1>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>الصفحة غير موجودة</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            عذراً، الصفحة التي تبحث عنها غير موجودة
          </p>
          <a href="/" className="btn btn-primary">
            العودة للرئيسية
          </a>
        </div>
      </CustomerLayout>
    )
  }
]);


// Sidebar active link styles
const sidebarStyles = `
  aside nav a:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-right-color: var(--secondary-color);
  }
  aside nav a.active {
    background-color: rgba(255, 255, 255, 0.15);
    border-right-color: var(--secondary-color);
  }
  aside button:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 1024px) {
    aside {
      display: none;
    }
    main {
      margin-right: 0 !important;
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sidebarStyles;
  if (!document.head.querySelector('style[data-sidebar]')) {
    styleSheet.setAttribute('data-sidebar', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default router;