import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Pages.css';

export default function OrdersPage({ handleLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
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

  const fetchOrderDetails = async (order) => {
    setDetailsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/orders/${order.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch order details');
      const details = await response.json();
      
      // Fetch restaurant data
      const restaurantResponse = await fetch(`http://127.0.0.1:8000/restaurants/${order.restaurant_id}`);
      const restaurantData = await restaurantResponse.json();
      
      setSelectedOrderDetails({ ...details, restaurantName: restaurantData.name });
    } catch (error) {
      console.error('Error fetching order details:', error);
      showToast('Failed to load order details', 'error');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    fetchOrderDetails(order);
  };

  const calculateCharges = (total) => {
    // Reverse calculate based on the total stored
    // We know: grandTotal = subtotal + (subtotal * 0.18) + 49 + 30
    // So: subtotal = grandTotal / 1.18 - (49 + 30) / 1.18
    // But we'll estimate based on the pattern
    const platformCharges = 49;
    const deliveryFees = 30;
    const fixedCharges = platformCharges + deliveryFees;
    
    // Using formula: grandTotal = subtotal * 1.18 + 79
    // subtotal = (grandTotal - 79) / 1.18
    const subtotal = Math.round((total - fixedCharges) / 1.18);
    const gst = Math.round((subtotal * 18) / 100);
    
    return {
      subtotal,
      gst,
      platformCharges,
      deliveryFees,
      grandTotal: total
    };
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

  // If an order is selected, show detail view
  if (selectedOrder && selectedOrderDetails) {
    const charges = calculateCharges(selectedOrder.total_price);
    
    return (
      <div className="page-container">
        <header className="header-gradient">
          <h1>🍽️ Food Delivery</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders" style={{ color: '#ffd700' }}>My Orders</Link>
            <Link to="/support">💬 Help & Support</Link>
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

        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <button 
              onClick={() => setSelectedOrder(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0.5rem 0'
              }}
            >
              ← Back to Orders
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            {/* Order Header */}
            <div style={{ marginBottom: '2rem', borderBottom: '2px solid #667eea', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Order #{selectedOrder.id}</h2>
                <span className={`status-badge ${getStatusBadgeClass(selectedOrder.status)}`} style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                  {selectedOrder.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
              <p style={{ margin: 0, color: '#999', fontSize: '0.95rem' }}>
                {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Restaurant Info */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>🏪 Restaurant</h3>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#667eea' }}>
                {selectedOrderDetails.restaurantName || 'Restaurant'}
              </p>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>📋 Order Items</h3>
              <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '1.5rem' }}>
                {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? (
                  selectedOrderDetails.items.map((item, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: idx < selectedOrderDetails.items.length - 1 ? '1rem' : 0,
                      paddingBottom: idx < selectedOrderDetails.items.length - 1 ? '1rem' : 0,
                      borderBottom: idx < selectedOrderDetails.items.length - 1 ? '1px solid #ddd' : 'none'
                    }}>
                      <div>
                        <p style={{ margin: '0 0 0.3rem', fontWeight: '600', fontSize: '0.95rem' }}>
                          {item.menu_item_id}
                        </p>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#667eea' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#999' }}>No items in this order</p>
                )}
              </div>
            </div>

            {/* Charges Breakdown */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>💰 Bill Details</h3>
              <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid #ddd' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: '600' }}>₹{charges.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#666', fontSize: '0.95rem' }}>
                  <span>GST (18%):</span>
                  <span>₹{charges.gst.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#666', fontSize: '0.95rem' }}>
                  <span>Platform Charges:</span>
                  <span>₹{charges.platformCharges}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#666', fontSize: '0.95rem', paddingBottom: '1rem', borderBottom: '2px solid #667eea' }}>
                  <span>Delivery Fees:</span>
                  <span>₹{charges.deliveryFees}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '700', color: '#667eea' }}>
                  <span>Grand Total:</span>
                  <span>₹{charges.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>🚚 Delivery Details</h3>
              <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.9rem' }}>Delivery Address:</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>{selectedOrder.delivery_address || 'N/A'}</p>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.9rem' }}>Phone Number:</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>{selectedOrder.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.9rem' }}>Payment Method:</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>{selectedOrder.payment_method?.toUpperCase() || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button 
              onClick={() => setSelectedOrder(null)}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '0.8rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              ← Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="header-gradient">
        <h1>🍽️ Food Delivery</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders" style={{ color: '#ffd700' }}>My Orders</Link>
          <Link to="/support">💬 Help & Support</Link>
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
              <div 
                key={order.id} 
                onClick={() => handleOrderClick(order)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
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
                  <span className={`status-badge ${getStatusBadgeClass(order.status)}`} style={{ cursor: 'pointer' }}>
                    {order.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '1rem' }}>
                  <div>
                    <p><strong>Delivery Address:</strong> {order.delivery_address}</p>
                    <p><strong>Phone:</strong> {order.phone_number}</p>
                    <p><strong>Payment:</strong> {order.payment_method?.toUpperCase() || 'N/A'}</p>
                    <p style={{ color: '#667eea', marginTop: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                      👉 Click to view details →
                    </p>
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
                      ₹{order.total_price?.toLocaleString('en-IN') || '0'}
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
