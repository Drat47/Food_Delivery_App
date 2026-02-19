// API Service for handling all backend calls

const API_BASE_URL = 'http://127.0.0.1:8000';

export const apiService = {
  // Auth endpoints
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username: email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  async register(username, email, password, role) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role }),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  // Restaurant endpoints
  async getRestaurants() {
    const response = await fetch(`${API_BASE_URL}/restaurants`);
    if (!response.ok) throw new Error('Failed to fetch restaurants');
    return response.json();
  },

  async getRestaurantDetails(restaurantId) {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`);
    if (!response.ok) throw new Error('Failed to fetch restaurant details');
    return response.json();
  },

  async getMenu(restaurantId) {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu');
    return response.json();
  },

  // Order endpoints
  async createOrder(data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  async getOrders() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  // Admin endpoints
  async getUsers() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async updateOrder(orderId, status) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
  },
};

export const showToast = (message, type = 'info') => {
  const event = new CustomEvent('showToast', { detail: { message, type } });
  window.dispatchEvent(event);
};
