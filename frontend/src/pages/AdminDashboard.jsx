import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Pages.css';

export default function AdminDashboard({ handleLogout }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeOrders: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message, type = 'info') => {
    const event = new CustomEvent('showToast', {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const usersData = await response.json();
      setUsers(usersData);
      setStats({
        totalUsers: usersData.length,
        activeOrders: Math.floor(Math.random() * 50),
        totalOrders: Math.floor(Math.random() * 500),
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showToast('Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className="page-container">
      <header className="header-gradient">
        <h1>⚙️ Admin Dashboard</h1>
        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/">Back to Home</Link>
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
        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>System Overview</h2>

        {/* Stats Cards */}
        <div className="admin-grid">
          <div className="admin-card">
            <div className="number">{stats.totalUsers}</div>
            <div className="label">Total Users</div>
          </div>
          <div className="admin-card">
            <div className="number">{stats.activeOrders}</div>
            <div className="label">Active Orders</div>
          </div>
          <div className="admin-card">
            <div className="number">{stats.totalOrders}</div>
            <div className="label">Total Orders</div>
          </div>
        </div>

        {/* Users Table */}
        <h3 style={{ fontSize: '1.3rem', marginTop: '3rem', marginBottom: '1.5rem' }}>Registered Users</h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading users...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{
                      background: '#e3f2fd',
                      color: '#1976d2',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#e3f2fd',
          borderRadius: '8px',
          borderLeft: '4px solid #1976d2',
          color: '#1976d2'
        }}>
          <strong>Total Users:</strong> {users.length} | <strong>Admins:</strong> {users.filter(u => u.role === 'admin').length}
        </div>
      </div>
    </div>
  );
}
