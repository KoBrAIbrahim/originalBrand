import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Home, Phone } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={styles.navbar}>
      <div className="container">
        <div style={styles.navContent}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>OB</div>
            <span style={styles.logoText}>Original Brand</span>
          </Link>

          {/* Desktop Menu */}
          <div style={styles.desktopMenu}>
            <Link 
              to="/" 
              style={{
                ...styles.navLink,
                ...(isActive('/') ? styles.navLinkActive : {})
              }}
            >
              <Home size={20} />
              <span>الرئيسية</span>
            </Link>
            <Link 
              to="/contact" 
              style={{
                ...styles.navLink,
                ...(isActive('/contact') ? styles.navLinkActive : {})
              }}
            >
              <Phone size={20} />
              <span>تواصل معنا</span>
            </Link>
            <Link to="/cart" style={styles.cartButton}>
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span style={styles.cartBadge}>{getTotalItems()}</span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button style={styles.menuButton} onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={styles.mobileMenu}>
            <Link 
              to="/" 
              style={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={20} />
              <span>الرئيسية</span>
            </Link>
            <Link 
              to="/contact" 
              style={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone size={20} />
              <span>تواصل معنا</span>
            </Link>
            <Link 
              to="/cart" 
              style={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart size={20} />
              <span>السلة ({getTotalItems()})</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: 'var(--secondary-color)',
    boxShadow: 'var(--shadow)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '1rem 0'
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    color: 'var(--primary-color)',
    fontWeight: 700,
    fontSize: '1.25rem'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.125rem'
  },
  logoText: {
    display: 'inline-block'
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'var(--text-color)',
    fontWeight: 600,
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  },
  navLinkActive: {
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)'
  },
  cartButton: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    borderRadius: '50%',
    textDecoration: 'none',
    transition: 'transform 0.3s ease'
  },
  cartBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: 'var(--error-color)',
    color: 'var(--secondary-color)',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700
  },
  menuButton: {
    display: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--primary-color)',
    cursor: 'pointer',
    padding: '0.5rem'
  },
  mobileMenu: {
    display: 'none',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-color)'
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--background-color)',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'var(--text-color)',
    fontWeight: 600,
    transition: 'background-color 0.3s ease'
  }
};

// Media Query Styles
const mediaStyles = `
  @media (max-width: 768px) {
    nav > div > div > div:nth-child(2) {
      display: none !important;
    }
    nav button {
      display: block !important;
    }
    nav > div > div:last-child {
      display: flex !important;
    }
  }
`;

// Add styles to head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mediaStyles;
  document.head.appendChild(styleSheet);
}

export default Navbar;