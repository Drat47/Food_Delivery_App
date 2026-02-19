
const API_URL = "http://localhost:8000";

// Toast Notification System
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) {
        console.error("Toast container not found");
        // Fallback or create container dynamically
        const newContainer = document.createElement('div');
        newContainer.id = 'toast-container';
        newContainer.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 9999;";
        document.body.appendChild(newContainer);
        // Retry immediately
        // return showToast(message, type); 
        // Recursive call might be dangerous without limit, so let's just append to new container
        const toast = createToastElement(message, type);
        newContainer.appendChild(toast);
        animateToast(toast);
        return;
    }
    const toast = createToastElement(message, type);
    container.appendChild(toast);
    animateToast(toast);
}

function createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add styles dynamically if not in CSS
    toast.style.padding = '1rem 2rem';
    toast.style.margin = '1rem';
    toast.style.borderRadius = '8px';
    toast.style.color = '#fff';
    toast.style.fontWeight = '500';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    toast.style.background = type === 'error' ? 'rgba(255, 71, 87, 0.9)' : 'rgba(46, 213, 115, 0.9)';
    toast.style.backdropFilter = 'blur(10px)';
    toast.style.animation = 'fadeIn 0.3s ease-out';
    toast.style.minWidth = '300px';
    toast.style.textAlign = 'center';
    return toast;
}

function animateToast(toast) {
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Auth Functions
async function login(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);
            showToast('Login successful', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } else {
            const data = await response.json();
            showToast(data.detail || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Connection error', 'error');
    }
}

async function register(username, email, password, role) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, role })
        });

        if (response.ok) {
            showToast('Registration successful! Redirecting to login...', 'success');
            setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
            const data = await response.json();
            showToast(data.detail || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Connection error', 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Data Fetching
async function fetchRestaurants() {
    try {
        const response = await fetch(`${API_URL}/restaurants`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (e) {
        showToast('Error loading restaurants', 'error');
        return [];
    }
}

async function fetchMenu(restaurantId) {
    try {
        const response = await fetch(`${API_URL}/restaurants/${restaurantId}/menu`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (e) {
        showToast('Error loading menu', 'error');
        return [];
    }
}

async function fetchRestaurantDetails(restaurantId) {
    try {
        const response = await fetch(`${API_URL}/restaurants/${restaurantId}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (e) {
        showToast('Error loading restaurant details', 'error');
        return null;
    }
}

async function addToCart(restaurantId, itemId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || { restaurantId: null, items: [] };

    if (cart.restaurantId && cart.restaurantId !== restaurantId) {
        if (!confirm("Start a new order? This will clear your current cart.")) {
            return;
        }
        cart = { restaurantId: restaurantId, items: [] };
    }

    cart.restaurantId = restaurantId;
    const existingItem = cart.items.find(i => i.menu_item_id === itemId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({ menu_item_id: itemId, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showToast('Added to cart', 'success');
}

async function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart || cart.items.length === 0) {
        showToast('Cart is empty', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/orders/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                restaurant_id: cart.restaurantId,
                items: cart.items
            })
        });

        if (response.ok) {
            showToast('Order placed successfully!', 'success');
            localStorage.removeItem('cart');
            setTimeout(() => window.location.href = 'orders.html', 1500);
        } else {
            showToast('Failed to place order', 'error');
        }
    } catch (e) {
        showToast('Connection error', 'error');
    }
}

async function fetchOrders() {
    try {
        const response = await fetch(`${API_URL}/orders/`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (e) {
        showToast('Error loading orders', 'error');
        return [];
    }
}
