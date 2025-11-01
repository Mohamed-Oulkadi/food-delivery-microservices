import { useState, useEffect } from 'react';
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

type Route = {
  page: 'home' | 'login' | 'register' | 'restaurant' | 'my-orders' | 'admin' | 'driver-dashboard';
  restaurantId?: string;
};

const AppContent = () => {
  const [route, setRoute] = useState<Route>({ page: 'home' });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useApp();

  useEffect(() => {
    // Redirect logic based on user role
    if (!user && route.page !== 'login' && route.page !== 'register') {
      setRoute({ page: 'login' });
    } else if (user) {
      // Redirect to appropriate home page based on role
      if (route.page === 'login' || route.page === 'register') {
        if (user.role === 'ROLE_ADMIN') {
          setRoute({ page: 'admin' });
        } else if (user.role === 'ROLE_DRIVER') {
          setRoute({ page: 'driver-dashboard' });
        } else {
          setRoute({ page: 'home' });
        }
      }

      // Prevent unauthorized access
      if (route.page === 'admin' && user.role !== 'ROLE_ADMIN') {
        setRoute({ page: 'home' });
      }
      if (route.page === 'driver-dashboard' && user.role !== 'ROLE_DRIVER') {
        setRoute({ page: 'home' });
      }
    }
  }, [user]);

  const handleNavigate = (page: string, restaurantId?: string) => {
    setRoute({ page: page as Route['page'], restaurantId });
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const renderPage = () => {
    switch (route.page) {
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'home':
        if (user?.role === 'ROLE_ADMIN') {
          return <AdminPage />;
        } else if (user?.role === 'ROLE_DRIVER') {
          return <DriverDashboard />;
        }
        return <CustomerHome onNavigate={handleNavigate} />;
      case 'restaurant':
        return route.restaurantId ? (
          <RestaurantMenu restaurantId={route.restaurantId} onNavigate={handleNavigate} />
        ) : (
          <CustomerHome onNavigate={handleNavigate} />
        );
      case 'my-orders':
        return <MyOrders />;
      case 'admin':
        return <AdminPage />;
      case 'driver-dashboard':
        return <DriverDashboard />;
      default:
        return <CustomerHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={handleNavigate} onOpenCart={handleOpenCart} />
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
