import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RestaurantPage from './pages/RestaurantPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import Toast from './components/Toast';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {isAuthenticated ? (
          <>
            <Route path="/" element={<DashboardPage handleLogout={handleLogout} />} />
            <Route path="/restaurant/:id" element={<RestaurantPage handleLogout={handleLogout} />} />
            <Route path="/cart" element={<CartPage handleLogout={handleLogout} />} />
            <Route path="/checkout" element={<CheckoutPage handleLogout={handleLogout} />} />
            <Route path="/orders" element={<OrdersPage handleLogout={handleLogout} />} />
            {userRole === 'admin' && <Route path="/admin" element={<AdminDashboard handleLogout={handleLogout} />} />}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
