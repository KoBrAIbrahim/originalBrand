import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuthContext();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // إذا كان المستخدم مسجل دخول، نوجهه للوحة التحكم
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // التوجيه سيحدث تلقائياً عبر useEffect
    } catch (err) {
      setError(err.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            <span style={styles.logoText}>OB</span>
          </div>
          <h1 style={styles.title}>Original Brand</h1>
          <p style={styles.subtitle}>لوحة التحكم</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              <User size={20} style={{ marginLeft: '0.5rem' }} />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="admin@gmail.com"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              <Lock size={20} style={{ marginLeft: '0.5rem' }} />
              كلمة المرور
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="أدخل كلمة المرور"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        {/* Footer Note */}
        <div style={styles.note}>
          <p style={styles.noteText}>
            🔒 هذه الصفحة مخصصة للإدارة فقط
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--background-color)',
    padding: '2rem'
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginBox: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'var(--secondary-color)',
    borderRadius: '16px',
    padding: '3rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  logo: {
    width: '80px',
    height: '80px',
    backgroundColor: 'var(--primary-color)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem'
  },
  logoText: {
    color: 'var(--secondary-color)',
    fontSize: '2rem',
    fontWeight: 700
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    margin: '0 0 0.5rem 0'
  },
  subtitle: {
    fontSize: '1.125rem',
    color: 'var(--text-light)',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  submitButton: {
    marginTop: '1rem',
    padding: '1rem',
    fontSize: '1.125rem'
  },
  note: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: 'var(--background-color)',
    borderRadius: '8px',
    textAlign: 'center'
  },
  noteText: {
    margin: 0,
    fontSize: '0.9375rem',
    color: 'var(--text-light)'
  }
};

export default LoginPage;