import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Pages.css';

export default function CartPage({ handleLogout }) {
  const [cart, setCart] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (itemId) => {
    if (cart) {
      cart.items = cart.items.filter((i) => i.menu_item_id !== itemId);
      if (cart.items.length === 0) {
        localStorage.removeItem('cart');
        setCart(null);
      } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        setCart({ ...cart });
      }
      const event = new CustomEvent('showToast', {
        detail: { message: 'Item removed from cart', type: 'info' },
      });
      window.dispatchEvent(event);
    }
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => {
      const product = menu.find((m) => m.id === item.menu_item_id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const foodImages = [
    'https://images.unsplash.com/photo-1574071318500-d0d512a86365?w=500&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
  ];

  return (
    <div className="page-container">
      <header className="header-gradient">
        <h1>🛒 Shopping Cart</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/cart" style={{ color: '#ffd700' }}>Cart</Link>
          <Link to="/orders">My Orders</Link>
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

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Main Content */}
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Your Items</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>Loading cart...</div>
          ) : !cart || cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🛒 Your cart is empty</h3>
              <p style={{ color: '#999', marginBottom: '1rem' }}>Start adding delicious dishes to your cart!</p>
              <Link to="/" className="btn-primary" style={{
                display: 'inline-block',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px'
              }}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-grid">
              {cart.items.map((cartItem, idx) => {
                const product = menu.find((m) => m.id === cartItem.menu_item_id);
                if (!product) return null;

                return (
                  <div key={cartItem.menu_item_id} className="cart-card">
                    <div
                      className="cart-img"
                      style={{ backgroundImage: `url('${foodImages[idx % foodImages.length]}')` }}
                    >
                      <div className="cart-badge">x{cartItem.quantity}</div>
                    </div>
                    <div className="cart-content">
                      <div className="cart-title">{product.name}</div>
                      <div style={{ color: '#f1c40f', fontSize: '0.8rem', marginBottom: '0.8rem' }}>★★★★★</div>
                      <div className="cart-price">
                        ₹{(product.price * cartItem.quantity).toLocaleString('en-IN')}
                      </div>
                      <button
                        className="cart-btn-remove"
                        onClick={() => removeFromCart(cartItem.menu_item_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        {cart && cart.items.length > 0 && (
          <div className="sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-title">Order Summary</h3>
              <div className="sidebar-box">
                <p style={{ margin: '0 0 1rem', color: '#555' }}>
                  Items in Cart: <strong>{cart.items.reduce((sum, i) => sum + i.quantity, 0)}</strong>
                </p>
                <p style={{
                  margin: '0 0 1rem',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  Total: ₹{calculateTotal().toLocaleString('en-IN')}
                </p>
                <button
                  className="btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>
                <div style={{
                  marginTop: '1rem',
                  fontSize: '0.75rem',
                  color: '#999',
                  textAlign: 'center'
                }}>
                  Fast • Secure • Reliable
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
