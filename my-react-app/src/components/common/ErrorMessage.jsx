import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="alert alert-error" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem',
      margin: '2rem auto',
      maxWidth: '600px'
    }}>
      <AlertCircle size={24} />
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0 }}>{message || 'حدث خطأ ما، الرجاء المحاولة مرة أخرى'}</p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;