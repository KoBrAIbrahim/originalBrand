import React from 'react';

const Loading = ({ message = 'جاري التحميل...' }) => {
  return (
    <div className="loading">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loading;