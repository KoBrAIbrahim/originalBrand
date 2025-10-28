import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'var(--primary-color)', trend }) => {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <div style={styles.content}>
        <div style={styles.info}>
          <h3 style={styles.title}>{title}</h3>
          <p style={styles.value}>{value}</p>
          {trend && (
            <span style={{ 
              ...styles.trend, 
              color: trend.type === 'up' ? 'var(--success-color)' : 'var(--error-color)' 
            }}>
              {trend.type === 'up' ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
        {Icon && (
          <div style={{ ...styles.iconContainer, backgroundColor: `${color}20` }}>
            <Icon size={32} color={color} />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem'
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-light)',
    margin: 0
  },
  value: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: 0,
    lineHeight: 1
  },
  trend: {
    fontSize: '0.875rem',
    fontWeight: 600
  },
  iconContainer: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }
};

// Add hover effect
const styleSheet = `
  .statsCard:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = styleSheet;
  if (!document.head.querySelector('style[data-stats-card]')) {
    style.setAttribute('data-stats-card', 'true');
    document.head.appendChild(style);
  }
}

export default StatsCard;