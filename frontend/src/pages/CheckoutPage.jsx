import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Pages.css';

export default function CheckoutPage({ handleLogout }) {
  const [cart, setCart] = useState(null);
  const [menu, setMenu] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    paymentMethod: 'card',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  useEffect(() => {
    loadCart();
  }, []);

  const showToast = (message, type = 'info') => {
    const event = new CustomEvent('showToast', {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  };

  const loadCart = async () => {
    try {
      const cartData = JSON.parse(localStorage.getItem('cart'));
      setCart(cartData);

      if (cartData && cartData.restaurantId) {
        const response = await fetch(`http://127.0.0.1:8000/restaurants/${cartData.restaurantId}/menu`);
        if (!response.ok) throw new Error('Failed to fetch menu');
        const menuData = await response.json();
        setMenu(menuData);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      showToast('Error loading cart', 'error');
    }
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => {
      const product = menu.find((m) => m.id === item.menu_item_id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const calculateCharges = () => {
    const subtotal = calculateTotal();
    const gst = Math.round((subtotal * 18) / 100);
    const platformCharges = 49;
    const deliveryFees = 30;
    const totalCharges = gst + platformCharges + deliveryFees;
    const grandTotal = subtotal + totalCharges;

    return {
      subtotal,
      gst,
      platformCharges,
      deliveryFees,
      totalCharges,
      grandTotal
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.phone) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const charges = calculateCharges();
      const orderData = {
        restaurant_id: cart.restaurantId,
        items: cart.items,
        delivery_address: formData.address,
        phone_number: formData.phone,
        payment_method: formData.paymentMethod,
        total_amount: charges.grandTotal,
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to place order');

      localStorage.removeItem('cart');
      showToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      showToast(error.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  if (!cart) {
    return (
      <div className="page-container">
        <header className="header-gradient">
          <h1>🛒 CHECKOUT</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h3>Your cart is empty</h3>
          <Link to="/" className="btn-primary" style={{
            display: 'inline-block',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            marginTop: '1rem'
          }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const charges = calculateCharges();

  return (
    <div className="page-container">
      <header className="header-gradient">
        <h1>🛒 CHECKOUT</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My Orders</Link>
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

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', maxWidth: '100%', padding: '3rem 4rem' }}>
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="checkout-form">
          <h2>Delivery Details</h2>

          <div className="form-group">
            <label>Delivery Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your delivery address"
              rows="4"
              style={{ resize: 'none' }}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="wallet">Digital Wallet</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '2rem' }} disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="sidebar">
          <h3 className="sidebar-title">Order Summary</h3>

          <div className="sidebar-box">
            {cart.items.map((item) => {
              const product = menu.find((m) => m.id === item.menu_item_id);
              if (!product) return null;
              return (
                <div key={item.menu_item_id} className="order-summary-item">
                  <span>{product.name} x{item.quantity}</span>
                  <span>₹{(product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              );
            })}

            {/* Charges Breakdown */}
            <div style={{
              borderTop: '2px solid #667eea',
              marginTop: '1rem',
              paddingTop: '1rem',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontWeight: '500' }}>
                <span>Subtotal:</span>
                <span>₹{charges.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: '#666', fontSize: '0.85rem' }}>
                <span>GST (18%):</span>
                <span>₹{charges.gst.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: '#666', fontSize: '0.85rem' }}>
                <span>Platform Charges:</span>
                <span>₹{charges.platformCharges}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#666', fontSize: '0.85rem' }}>
                <span>Delivery Fees:</span>
                <span>₹{charges.deliveryFees}</span>
              </div>
            </div>

            <div className="order-summary-total">
              <span>Grand Total:</span>
              <span>₹{charges.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#d4edda',
            borderRadius: '8px',
            color: '#155724',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            ✓ Fast delivery guaranteed<br />
            ✓ Secure payment
          </div>
        </div>
      </div>
    </div>
  );
}
