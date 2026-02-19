import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Pages.css';

export default function DashboardPage({ handleLogout }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const showToast = (message, type = 'info') => {
    const event = new CustomEvent('showToast', {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  };

  const fetchRestaurants = async () => {
    try {
      console.log('Fetching restaurants from http://127.0.0.1:8000/restaurants');
      const response = await fetch('http://127.0.0.1:8000/restaurants');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('Restaurants loaded:', data);
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      showToast('Failed to load restaurants: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const restaurantImages = [
    'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=600&q=80',
    'https://images.unsplash.com/photo-1571407970349-bc81e7ed3f47?w=600&q=80',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  ];

  return (
    <div className="page-container">
      <header className="header-gradient">
        <h1>🍽️ Food Delivery</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
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

      <div className="container">
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🍽️ Discover Restaurants</h2>
        <p style={{ color: '#999', marginBottom: '2rem' }}>Order from your favorite restaurants</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Loading restaurants...</div>
        ) : (
          <div className="restaurant-grid">
            {restaurants.map((restaurant, idx) => (
              <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`} style={{ textDecoration: 'none' }}>
                <div className="restaurant-card">
                  <div
                    className="restaurant-image"
                    style={{
                      backgroundImage: `url('${restaurantImages[idx % restaurantImages.length]}')`,
                    }}
                  >
                    <div className="restaurant-badge">OPEN</div>
                  </div>
                  <div className="restaurant-info">
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.description || 'Delicious food delivered fast'}</p>
                    <div className="restaurant-rating">★★★★★ (250+ reviews)</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
