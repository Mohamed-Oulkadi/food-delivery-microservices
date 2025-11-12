import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { Header } from './components/Header';
import { CartSheet } from './components/CartSheet';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CustomerHome } from './pages/CustomerHome';
import { RestaurantMenu } from './pages/RestaurantMenu';
import { MyOrders } from './pages/MyOrders';
import { AdminPage } from './pages/AdminPage';
import { DriverDashboard } from './pages/DriverDashboard';
import { Toaster } from './components/ui/sonner';
import { ProtectedRoute } from './components/ProtectedRoute';

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useApp();
  const location = useLocation();

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenCart={handleOpenCart} currentPage={location.pathname} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']} />}>
          <Route path="/" element={<CustomerHome />} />
          <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/*"
            element={
              <AdminPage />
            }
          />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ROLE_DRIVER']} />}>
          <Route path="/driver" element={<DriverDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to={user ? (user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : (user.role === 'ROLE_DRIVER' ? '/driver' : '/')) : '/login'} />} />
      </Routes>
      {user?.role === 'ROLE_CUSTOMER' && (
        <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
