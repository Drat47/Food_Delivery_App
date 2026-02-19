import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Pages.css';

export default function OrdersPage({ handleLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  useEffect(() => {
    fetchOrders();
  }, []);

  const showToast = (message, type = 'info') => {
    const event = new CustomEvent('showToast', {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/orders', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'delivered') return 'delivered';
    if (status === 'pending') return 'pending';
    return '';
  };

  return (
    <div className="page-container">
      <header className="header-gradient">
        <h1>🍽️ Food Delivery</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders" style={{ color: '#ffd700' }}>My Orders</Link>
          {user && <span className="user-info">Hi, {user}</span>}
          <button onClick={handleLogoutClick} style={{
            background: 'none',
            border: 'none',
            color: '#ffd700',
            cursor: 'pointer',
            fontSize: '0.8rem',
            marginLeft: '2rem'
          }}>
            Logout
          </button>
        </nav>
      </header>

      <div className="container">
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>📦 My Orders</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No orders yet</h3>
            <p style={{ color: '#999', marginBottom: '1rem' }}>Start ordering from your favorite restaurants!</p>
            <Link to="/" className="btn-primary" style={{
              display: 'inline-block',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem'
            }}>
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {orders.map((order) => (
              <div key={order.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Order #{order.id}</h3>
                    <p style={{ margin: 0, color: '#999', fontSize: '0.9rem' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem' }}>
                  <div>
                    <p><strong>Delivery Address:</strong> {order.delivery_address}</p>
                    <p><strong>Phone:</strong> {order.phone_number}</p>
                    <p><strong>Payment:</strong> {order.payment_method?.toUpperCase() || 'N/A'}</p>
                  </div>
                  <div style={{
                    background: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'right'
                  }}>
                    <p style={{ margin: 0, color: '#999', fontSize: '0.85rem' }}>Total Amount</p>
                    <p style={{
                      margin: '0.5rem 0 0',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#667eea'
                    }}>
                      ₹{order.total_amount?.toLocaleString('en-IN') || '0'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
