import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, MenuItem, User } from '../lib/mockData';
import * as api from '../services/api';

interface AppContextType {
  user: User | null;
  login: (username: string, password:string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string, role: string) => Promise<boolean>;
  cart: CartItem[];
  addToCart: (menuItem: MenuItem) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      return null;
    }
  });
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Failed to update user in localStorage', error);
    }
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login({ username, password });
      // Map backend UserDto (userId) to frontend User (id)
      const dto = response.data as any;
      const mappedUser = {
        id: dto.userId ? String(dto.userId) : dto.id ?? dto.username,
        username: dto.username,
        email: dto.email,
        role: dto.role || 'ROLE_CUSTOMER'
      };
      console.log('Logged in user role:', mappedUser.role);
      setUser(mappedUser);
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const register = async (username: string, email: string, password: string, role: string): Promise<boolean> => {
    try {
      const response = await api.register({ username, email, password, role });
      // Optionally set user after registration
      const dto = (response as any).data;
      if (dto) {
        setUser({ id: dto.userId ? String(dto.userId) : dto.id ?? username, username: dto.username, email: dto.email, role: dto.role });
      }
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  };

const addToCart = (menuItem: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.menuItem.id === menuItem.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.menuItem.id !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
