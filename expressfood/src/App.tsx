import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { Home } from './pages/Home';
import { RestaurantDetails } from './pages/RestaurantDetails';
import { Checkout } from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MyOrders from './pages/MyOrders';
import DriverDashboard from './pages/DriverDashboard';
import RestaurantOwnerDashboard from './pages/RestaurantOwnerDashboard';
import DriverProfile from './pages/DriverProfile';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantManagement from './pages/RestaurantManagement';
import CustomerManagement from './pages/CustomerManagement';
import DriverManagement from './pages/DriverManagement';
import { AdminLayout } from './components/AdminLayout';
import { CustomerProfile } from './pages/CustomerProfile';

import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {!isAuthPage && <Navbar />}
      <CartDrawer />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track/:id" element={<OrderTracking />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/restaurant-owner/*" element={<RestaurantOwnerDashboard />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/driver/profile" element={<DriverProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/restaurants" element={<AdminLayout><RestaurantManagement /></AdminLayout>} />
          <Route path="/admin/customers" element={<AdminLayout><CustomerManagement /></AdminLayout>} />
          <Route path="/admin/drivers" element={<AdminLayout><DriverManagement /></AdminLayout>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
