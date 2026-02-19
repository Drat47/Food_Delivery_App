import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Pages.css';

export default function LoginPage({ setIsAuthenticated, setUserRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const showToast = (message, type = 'info') => {
    const event = new CustomEvent('showToast', {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('user', email);
      setIsAuthenticated(true);
      setUserRole(data.role);
      showToast('Login successful!', 'success');
      navigate('/');
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header className="header-gradient">
        <h1>🍽️ Food Delivery</h1>
      </header>

      <div className="login-container">
        <div className="login-card">
          <h2>Welcome Back!</h2>
          <p className="subtitle">Sign in to your account</p>

          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email or Username</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or username"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider">OR TRY DEMO</div>

          <div style={{ background: '#f0f4ff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <p style={{ margin: 0, marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Demo Credentials:</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Username: admin</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Password: password</p>
          </div>

          <div className="features">
            <div className="feature">
              <span className="icon">🚚</span>
              <h4>Fast Delivery</h4>
              <p>30 minutes guarantee</p>
            </div>
            <div className="feature">
              <span className="icon">💰</span>
              <h4>Best Prices</h4>
              <p>Affordable food</p>
            </div>
            <div className="feature">
              <span className="icon">⭐</span>
              <h4>Quality Food</h4>
              <p>Top restaurants</p>
            </div>
          </div>

          <p className="register-link">
            Don't have an account? <Link to="/register">Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
