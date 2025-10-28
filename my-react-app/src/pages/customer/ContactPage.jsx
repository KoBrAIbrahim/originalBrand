import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="container" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>تواصل معنا</h1>
        <p style={styles.subtitle}>
          نحن هنا للإجابة على استفساراتك ومساعدتك
        </p>
      </div>

      <div style={styles.content}>
        {/* Contact Cards */}
        <div style={styles.cardsContainer}>
          {/* WhatsApp */}
          <div style={styles.card}>
            <div style={{...styles.iconContainer, backgroundColor: '#25D366'}}>
              <MessageCircle size={32} color="white" />
            </div>
            <h3 style={styles.cardTitle}>واتساب</h3>
            <a 
              href="https://wa.me/970569858597" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.cardLink}
            >
              +970569858597
            </a>
            <p style={styles.cardDescription}>
              نرد على رسائلك في أسرع وقت ممكن
            </p>
          </div>

          {/* Location / Delivery */}
          <div style={styles.card}>
            <div style={{...styles.iconContainer, backgroundColor: 'var(--error-color)'}}>
              <MapPin size={32} color="white" />
            </div>
            <h3 style={styles.cardTitle}>الموقع</h3>
            <p style={styles.cardLink}>
              توصيل لكافة فلسطين
            </p>
            <p style={styles.cardDescription}>
              نوصل لعنوانك في أي مكان داخل فلسطين
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div style={styles.socialSection}>
          <h2 style={styles.socialTitle}>تابعنا على وسائل التواصل</h2>
          <div style={styles.socialLinks}>
            <a 
              href="https://www.facebook.com/profile.php?id=61582067737029&mibextid=wwXIfr&rdid=5HswldTf0fnY8VHF&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17AVBPuEXr%2F%3Fmibextid%3DwwXIfr#" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{...styles.socialButton, backgroundColor: '#1877F2'}}
            >
              <Facebook size={28} />
              <span>فيسبوك</span>
            </a>
            <a 
              href="https://www.instagram.com/originalbrand45?igsh=MTF3YnZlc3UzcDRpcw%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{...styles.socialButton, backgroundColor: '#E4405F'}}
            >
              <Instagram size={28} />
              <span>انستغرام</span>
            </a>
          </div>
        </div>

        {/* Info Section */}
        <div style={styles.infoSection}>
          <h2 style={styles.infoTitle}>ساعات العمل</h2>
          <div style={styles.workingHours}>
            <div style={styles.dayRow}>
              <span style={styles.day}>متوفر</span>
              <span style={styles.hours}>24 ساعة</span>
            </div>
          </div>
        </div>
      </div>
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
    marginBottom: '3rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: 'var(--text-light)'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem'
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem'
  },
  card: {
    backgroundColor: 'var(--secondary-color)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    transition: 'transform 0.3s ease'
  },
  iconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0
  },
  cardLink: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--primary-color)',
    textDecoration: 'none',
    transition: 'opacity 0.3s ease'
  },
  cardDescription: {
    fontSize: '0.9375rem',
    color: 'var(--text-light)',
    lineHeight: 1.6,
    margin: 0
  },
  socialSection: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: 'var(--background-color)',
    borderRadius: '12px'
  },
  socialTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    marginBottom: '2rem'
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    borderRadius: '12px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.125rem',
    fontWeight: 600,
    transition: 'transform 0.3s ease',
    boxShadow: 'var(--shadow)'
  },
  infoSection: {
    backgroundColor: 'var(--secondary-color)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)'
  },
  infoTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  workingHours: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '500px',
    margin: '0 auto'
  },
  dayRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: 'var(--background-color)',
    borderRadius: '8px'
  },
  day: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--text-color)'
  },
  hours: {
    fontSize: '1.125rem',
    color: 'var(--text-light)'
  }
};

export default ContactPage;