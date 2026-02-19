import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Pages.css';

const roles = [
  { value: 'customer', label: '🛍️ Customer', description: 'Browse restaurants and order food' },
  { value: 'restaurant', label: '🍳 Restaurant Owner', description: 'Manage your restaurant and menu' },
  { value: 'delivery_partner', label: '🚗 Delivery Partner', description: 'Deliver orders to customers' },
  { value: 'customer_care', label: '📞 Customer Care', description: 'Handle customer support' },
  { value: 'admin', label: '⚙️ Admin', description: 'Administrative access' },
];

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const showToast = (message, type = 'info') => {
    const event = new CustomEvent('showToast', {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('Please fill in all fields');
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!response.ok) throw new Error('Registration failed');

      showToast('Registration successful! Please login.', 'success');
      navigate('/login');
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find((r) => r.value === role);

  return (
    <div className="page-container">
      <header className="header-gradient">
        <h1>🍽️ Food Delivery</h1>
      </header>

      <div className="register-container">
        <div className="register-card">
          <h2>Create Account</h2>
          <p className="subtitle">Join us and start using our service</p>

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

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>

            <div className="form-group">
              <label>Select Your Role</label>
              <div className="role-selector">
                {roles.map((r) => (
                  <label key={r.value} className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
              {selectedRole && (
                <div className="role-description">{selectedRole.description}</div>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="register-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
