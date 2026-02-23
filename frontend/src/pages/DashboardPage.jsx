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
    'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=300&q=40',
    'https://images.unsplash.com/photo-1571407970349-bc81e7ed3f47?w=300&q=40',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&q=40',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=40',
  ];

  const getRestaurantImage = (restaurant) => {
    return restaurant.image_url?.replace('w=600', 'w=300').replace('q=80', 'q=40') || restaurantImages[Math.floor(Math.random() * restaurantImages.length)];
  };

  const getRepresentativeDishImage = (restaurantName) => {
    const name = restaurantName.toLowerCase();
    const dishImages = {
      'tasty bytes': ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=250&q=40',
                      'https://images.unsplash.com/photo-1550547990-d5d85ad26ae3?w=250&q=40'],
      'pizza': ['https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=250&q=40',
                'https://images.unsplash.com/photo-1558522479-e6d2dfd4e71b?w=250&q=40'],
      'spice route': ['https://images.unsplash.com/photo-1603566438886-609f4ee62e51?w=250&q=40',
                      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=250&q=40'],
      'dragon': ['https://images.unsplash.com/photo-1569718899523-5e673bf89e72?w=250&q=40',
                 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=250&q=40'],
      'burger': ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=250&q=40',
                 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=250&q=40'],
      'grill': ['https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=250&q=40',
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=250&q=40'],
      'sushi': ['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=250&q=40',
                'https://images.unsplash.com/photo-1580959375944-abd7e991f971?w=250&q=40'],
    };

    for (const [key, imageArray] of Object.entries(dishImages)) {
      if (name.includes(key)) {
        return imageArray[Math.floor(Math.random() * imageArray.length)];
      }
    }
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=250&q=40';
  };

  return (
    <div className="page-container">
      <header className="header-gradient">
        <h1>🍽️ Food Delivery</h1>
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
                      backgroundImage: `url('${getRestaurantImage(restaurant)}')`,
                      backgroundColor: '#f0f0f0',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="restaurant-badge">OPEN</div>
                  </div>
                  <div style={{
                    height: '120px',
                    backgroundImage: `url('${getRepresentativeDishImage(restaurant.name)}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderBottom: '3px solid #f0f0f0',
                    backgroundColor: '#e8e8e8',
                    backgroundAttachment: 'local'
                  }}>
                  </div>
                  <div className="restaurant-info">
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.description || 'Delicious food delivered fast'}</p>
                    {restaurant.address && <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>📍 {restaurant.address}</p>}
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
