import { useState, useEffect } from 'react';
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

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useApp();
  const location = useLocation();

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const renderPage = () => {
    if (!user) {
      return (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      );
    }

    if (user.role === 'ROLE_ADMIN') {
      return (
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      );
    }

    if (user.role === 'ROLE_DRIVER') {
      return (
        <Routes>
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="*" element={<Navigate to="/driver" />} />
        </Routes>
      );
    }

    return (
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenCart={handleOpenCart} currentPage={location.pathname} />
      {renderPage()}
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
