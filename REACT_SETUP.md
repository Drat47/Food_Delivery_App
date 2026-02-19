# Food Delivery App - React Stack Conversion Guide

## ✅ Conversion Complete!

Your food delivery application has been successfully converted from vanilla HTML/CSS/JavaScript to a modern **React.js** stack with the following features:

## 📁 Project Structure

```
frontend/
├── index.html                 # Entry HTML file
├── vite.config.js             # Vite configuration with React plugin
├── package.json               # Dependencies (React, React Router, etc.)
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Main app component with routing
│   ├── index.css             # Global styles
│   ├── pages/
│   │   ├── LoginPage.jsx     # Login component
│   │   ├── RegisterPage.jsx  # Registration component
│   │   ├── DashboardPage.jsx # Restaurant listing
│   │   ├── RestaurantPage.jsx# Menu & ordering
│   │   ├── CartPage.jsx      # Shopping cart
│   │   ├── CheckoutPage.jsx  # Order finalization
│   │   ├── OrdersPage.jsx    # Order history
│   │   ├── AdminDashboard.jsx# Admin panel
│   │   └── Pages.css         # Shared page styles
│   ├── components/
│   │   ├── Toast.jsx         # Notification component
│   │   └── Toast.css         # Toast styles
│   └── services/
│       └── apiService.js     # API communication layer

app/
├── main.py                   # FastAPI backend (unchanged)
└── ... (other backend files)
```

## 🚀 Technology Stack

### Frontend (New)
- **React 18.2** - Modern UI library
- **React Router 6** - Client-side routing
- **Vite 5** - Lightning-fast build tool
- **Vanilla CSS** - Beautiful gradient designs

### Backend (Existing)
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 🎯 Key Features Implemented

### Components Created

1. **LoginPage.jsx**
   - Email/Username authentication
   - Modern gradient design
   - Feature highlights
   - Navigation to register page

2. **RegisterPage.jsx**
   - 5-role selection dropdown
   - Interactive role descriptions
   - Email validation
   - Seamless signup flow

3. **DashboardPage.jsx**
   - Restaurant listing with images
   - Click to view menu
   - Rating display
   - Responsive grid layout

4. **RestaurantPage.jsx**
   - Restaurant details with hero banner
   - Dynamic menu display
   - Add to cart with quantity selector
   - Smart dish image mapping

5. **CartPage.jsx**
   - View all cart items
   - Remove items
   - Order summary sidebar
   - Checkout button

6. **CheckoutPage.jsx**
   - Delivery address form
   - Phone number input
   - Payment method selection
   - Order confirmation

7. **OrdersPage.jsx**
   - View order history
   - Status tracking
   - Order details
   - Amount display

8. **AdminDashboard.jsx**
   - System statistics
   - User management
   - Data tables
   - Admin controls

### API Service Layer (apiService.js)

```javascript
// All API requests centralized
apiService.login(email, password)
apiService.register(username, email, password, role)
apiService.getRestaurants()
apiService.getRestaurantDetails(id)
apiService.getMenu(restaurantId)
apiService.createOrder(data)
apiService.getOrders()
apiService.getUsers()
apiService.updateOrder(orderId, status)
```

## 📦 Installation & Setup

### 1. Backend Setup (FastAPI)
```bash
cd d:\Dharmesh\HCL-PROJECT-TEST

# Install Python dependencies
pip install -r requirements.txt

# Run the backend
python -m uvicorn app.main:app --reload

# Server runs at http://127.0.0.1:8000
```

### 2. Frontend Setup (React)
```bash
cd frontend

# Dependencies already installed via npm install
# Start development server
npm run dev

# Server runs at http://localhost:5173
```

### 3. Access the Application
- Open browser: http://localhost:5173
- Login with test credentials or register new account
- Test credentials available in backend docs

## 🔄 State Management

### Local Storage Usage
- **token**: JWT authentication token
- **role**: User role (customer, restaurant, delivery_partner, etc.)
- **user**: Username/email
- **cart**: Shopping cart data with items and restaurant ID

### React Hooks
- `useState` - Component state management
- `useEffect` - Side effects and API calls
- `useNavigate` - Page navigation
- `useParams` - Route parameters

## 🎨 Styling System

### CSS Features
- **Color Scheme**
  - Primary Gradient: `#667eea` to `#764ba2` (purple-blue)
  - Text Dark: `#2c3e50`
  - Text Light: `#555`
  - Success: `#4caf50`
  - Error: `#ff5252`

- **Components Styled**
  - Cards with hover effects
  - Gradient buttons
  - Responsive grid layouts
  - Toast notifications
  - Status badges
  - Input fields with focus states

- **Responsive Design**
  - Mobile-first approach
  - Breakpoints for tablets/desktops
  - Flexible grid layouts
  - Touch-friendly buttons

## 🔗 API Integration

### CORS Configuration
Backend is configured to accept requests from any origin:
```python
CORSMiddleware(
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Proxy Configuration (Vite)
```javascript
// vite.config.js proxies API calls to backend
proxy: {
    '/auth': 'http://127.0.0.1:8000',
    '/admin': 'http://127.0.0.1:8000',
    '/restaurants': 'http://127.0.0.1:8000',
    '/orders': 'http://127.0.0.1:8000',
}
```

## 🧪 Testing the App

1. **Start Backend**
   ```bash
   cd d:\Dharmesh\HCL-PROJECT-TEST
   python seed_db.py  # Seed data
   python -m uvicorn app.main:app --reload
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Flow**
   - Visit http://localhost:5173
   - Click on login or register
   - Select 5-role dropdown for registration
   - Browse restaurants
   - Add items to cart
   - Checkout
   - View orders

## 📊 Build & Deployment

### Development Mode
```bash
cd frontend
npm run dev  # Development server with hot reload
```

### Production Build
```bash
cd frontend
npm run build  # Creates dist/ folder
npm run preview  # Preview production build
```

### Deploy Frontend
- Build files are in `frontend/dist/`
- Can be deployed to Vercel, Netlify, or any static host
- Or serve from FastAPI using `StaticFiles` middleware

## 🔧 Backend Integration Notes

The React app communicates with FastAPI backend at `http://127.0.0.1:8000`:

- **Auth Endpoints**: POST `/auth/login`, POST `/auth/register`
- **Restaurant Endpoints**: GET `/restaurants`, GET `/restaurants/{id}`, GET `/restaurants/{id}/menu`
- **Order Endpoints**: POST `/orders`, GET `/orders`, PUT `/admin/orders/{id}`
- **Admin Endpoints**: GET `/admin/users`

All requests include JWT token in Authorization header for protected routes.

## 📝 Environment Configuration

### Frontend API Base URL
Located in `src/services/apiService.js`:
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000';
```

Update this if backend runs on different host/port.

## ✨ Advantages of React Stack

1. **Component Reusability** - Build components once, use many times
2. **Hot Module Reload** - Changes reflect instantly during development
3. **Better State Management** - Easier to track and manage UI state
4. **Performance** - Virtual DOM for optimized rendering
5. **Developer Experience** - DevTools, debugging, extensions
6. **Scalability** - Easy to add new features and components
7. **Ecosystem** - Access to thousands of npm packages
8. **Type Safety** - Can add TypeScript for type checking

## 🎓 Learn More

- React Documentation: https://react.dev
- React Router: https://reactrouter.com
- Vite Guide: https://vitejs.dev
- FastAPI Integration: https://fastapi.tiangolo.com

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change Vite port if 5173 is busy
npm run dev -- --port 3000
```

### CORS Errors
- Ensure FastAPI CORS middleware is configured
- Check API base URL in `apiService.js`
- Verify backend is running on correct port

### API Connection Issues
- Check if backend server is running on port 8000
- Look for errors in browser console
- Check network tab in DevTools
- Verify database and seed data were created

### Build Issues
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
npm run build
```

## 📞 Support

For issues or questions:
1. Check browser console (F12) for error messages
2. Verify both frontend and backend are running
3. Check network requests in DevTools Network tab
4. Review API responses and status codes

---

**Conversion completed successfully!** Your app is now running on a modern React stack with all features preserved. 🎉
