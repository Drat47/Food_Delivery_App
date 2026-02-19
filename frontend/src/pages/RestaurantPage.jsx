import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Pages.css';

export default function RestaurantPage({ handleLogout }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const showToast = (message, type = 'info') => {
    const event = new CustomEvent('showToast', {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  };

  const fetchRestaurantData = async () => {
    try {
      console.log('Fetching restaurant data for ID:', id);
      const [restaurantResponse, menuResponse] = await Promise.all([
        fetch(`http://127.0.0.1:8000/restaurants/${id}`),
        fetch(`http://127.0.0.1:8000/restaurants/${id}/menu`),
      ]);

      if (!restaurantResponse.ok || !menuResponse.ok) {
        throw new Error(`Failed to fetch restaurant data - Restaurant: ${restaurantResponse.status}, Menu: ${menuResponse.status}`);
      }

      const restaurantData = await restaurantResponse.json();
      const menuData = await menuResponse.json();

      console.log('Restaurant data:', restaurantData);
      console.log('Menu data:', menuData);

      setRestaurant(restaurantData);
      setMenu(menuData || []);
      setQuantities({});
      
      if (!menuData || menuData.length === 0) {
        showToast('No menu items available', 'info');
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      showToast('Failed to load restaurant: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getDishImage = (dishName) => {
    const dishLower = dishName.toLowerCase();
    const images = {
      burger: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80',
               'https://images.unsplash.com/photo-1550547990-d5d85ad26ae3?w=300&q=80',
               'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&q=80'],
      pizza: ['https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80',
              'https://images.unsplash.com/photo-1558522479-e6d2dfd4e71b?w=300&q=80',
              'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=300&q=80'],
      biryani: ['https://images.unsplash.com/photo-1563379091339-03b21ab4a104?w=300&q=80',
                'https://images.unsplash.com/photo-1585238341710-4913d3a3a48f?w=300&q=80'],
      sushi: ['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&q=80',
              'https://images.unsplash.com/photo-1580959375944-abd7e991f971?w=300&q=80'],
      curry: ['https://images.unsplash.com/photo-1603566438886-609f4ee62e51?w=300&q=80',
              'https://images.unsplash.com/photo-1516559565752-63ea650e2c2d?w=300&q=80'],
      noodles: ['https://images.unsplash.com/photo-1569718899523-5e673bf89e72?w=300&q=80',
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80'],
    };

    for (const [key, imageArray] of Object.entries(images)) {
      if (dishLower.includes(key)) {
        return imageArray[Math.floor(Math.random() * imageArray.length)];
      }
    }
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80';
  };

  const handleAddToCart = (item) => {
    const qty = quantities[item.id] || 0;
    if (qty === 0) {
      const event = new CustomEvent('showToast', {
        detail: { message: 'Please select a quantity', type: 'error' },
      });
      window.dispatchEvent(event);
      return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || { restaurantId: id, items: [] };
    const existingItem = cart.items.find((i) => i.menu_item_id === item.id);

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ menu_item_id: item.id, quantity: qty });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setQuantities({ ...quantities, [item.id]: 0 });
    const event = new CustomEvent('showToast', {
      detail: { message: `${item.name} added to cart!`, type: 'success' },
    });
    window.dispatchEvent(event);
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="page-container">
        <header className="header-gradient">
          <h1>🍽️ Food Delivery</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Loading restaurant...</p>
          <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '1rem' }}>
            Restaurant ID: {id}
          </p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="page-container">
        <header className="header-gradient">
          <h1>🍽️ Food Delivery</h1>
          <nav>
            <Link to="/">Home</Link>
          </nav>
        </header>
        <div style={{ textAlign: 'center', padding: '4rem', color: '#c62828' }}>
          <p>Failed to load restaurant data</p>
          <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '1rem' }}>
            Check console for details. Restaurant ID: {id}
          </p>
          <Link to="/" style={{ marginTop: '1rem', display: 'inline-block' }} className="btn-primary">
            Back to Home
          </Link>
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
        {restaurant && (
          <>
            <div style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1555939594-58d7cb561404?w=1200&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '300px',
              borderRadius: '12px',
              marginBottom: '2rem',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '2rem',
              color: 'white',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '2.5rem' }}>{restaurant.name}</h2>
                <p style={{ margin: '0.5rem 0 0' }}>{restaurant.description || 'Delicious food await you'}</p>
              </div>
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🍽️ Our Specialties</h3>

            {menu && menu.length > 0 ? (
              <div className="restaurant-grid">
                {menu.map((item) => (
                  <div key={item.id} className="restaurant-card">
                    <div
                      className="restaurant-image"
                      style={{ backgroundImage: `url('${getDishImage(item.name)}')` }}
                    >
                      <div className="restaurant-badge">{item.name}</div>
                    </div>
                    <div className="restaurant-info">
                      <h3>{item.name}</h3>
                      <p>{item.description || 'A delicious dish'}</p>
                      <div className="restaurant-rating" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#667eea' }}>
                        ₹{item.price ? item.price.toLocaleString('en-IN') : '0'}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={quantities[item.id] || 0}
                          onChange={(e) =>
                            setQuantities({ ...quantities, [item.id]: parseInt(e.target.value) || 0 })
                          }
                          style={{
                            width: '60px',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                          }}
                        />
                        <button
                          className="btn-primary"
                          style={{ flex: 1 }}
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: '#f5f7fa',
                borderRadius: '12px',
                color: '#999'
              }}>
                <p>No menu items available for this restaurant</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
