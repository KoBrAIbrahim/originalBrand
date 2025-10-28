import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.footerContent}>
          {/* About Section */}
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Original Brand</h3>
            <p style={styles.footerText}>
              متجرك الموثوق للملابس والأحذية الأصلية بأفضل الأسعار
            </p>
          </div>

          {/* Quick Links */}
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>روابط سريعة</h4>
            <div style={styles.footerLinks}>
              <Link to="/" style={styles.footerLink}>الرئيسية</Link>
              <Link to="/contact" style={styles.footerLink}>تواصل معنا</Link>
              <Link to="/cart" style={styles.footerLink}>السلة</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>تواصل معنا</h4>
              <div style={styles.contactInfo}>
                <div style={styles.contactItem}>
                  <Phone size={18} />
                  <a href="https://wa.me/970569858597" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>+970569858597</a>
                </div>
                <div style={styles.contactItem}>
                  <MapPin size={18} />
                  <span>توصيل لكافة فلسطين</span>
                </div>
              </div>
          </div>

          {/* Social Media */}
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>تابعنا</h4>
            <div style={styles.socialLinks}>
              <a 
                href="https://www.facebook.com/profile.php?id=61582067737029&mibextid=wwXIfr&rdid=5HswldTf0fnY8VHF&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17AVBPuEXr%2F%3Fmibextid%3DwwXIfr#" 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.socialLink}
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://www.instagram.com/originalbrand45?igsh=MTF3YnZlc3UzcDRpcw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer"
                style={styles.socialLink}
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={styles.copyright}>
          <p style={{ margin: 0 }}>
            © {currentYear} Original Brand. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    marginTop: '4rem',
    padding: '3rem 0 1rem'
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  footerTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: 'var(--secondary-color)'
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.6
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem'
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    color: 'var(--secondary-color)',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  },
  copyright: {
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    paddingTop: '1.5rem',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)'
  }
};

export default Footer;