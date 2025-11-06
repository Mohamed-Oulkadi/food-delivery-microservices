
import axios from 'axios';
import { Restaurant, MenuItem, Order, User, Delivery } from '../lib/mockData';

// Use per-service base URLs. Each can be overridden via Vite env vars:
// VITE_RESTAURANT_BASE, VITE_ORDER_BASE, VITE_DELIVERY_BASE, VITE_USER_BASE
const env = (import.meta as any).env ?? {};
const RESTAURANT_BASE = env.VITE_RESTAURANT_BASE ?? 'http://localhost:8082';
const ORDER_BASE = env.VITE_ORDER_BASE ?? 'http://localhost:8081';
const DELIVERY_BASE = env.VITE_DELIVERY_BASE ?? 'http://localhost:8083';
const USER_BASE = env.VITE_USER_BASE ?? 'http://localhost:8084';

const restaurantService = axios.create({
  baseURL: `${RESTAURANT_BASE}/api/restaurants`,
});

const orderService = axios.create({
  baseURL: `${ORDER_BASE}/api/orders`,
});

const deliveryService = axios.create({
  baseURL: `${DELIVERY_BASE}/api/deliveries`,
});

const userService = axios.create({
  baseURL: `${USER_BASE}/api/users`,
});

// Restaurant Service
export const getRestaurants = () => restaurantService.get<Restaurant[]>('');
export const getRestaurantById = (id: string) => restaurantService.get<Restaurant>(`/${id}`);
export const getMenuItems = (restaurantId: string) => restaurantService.get<MenuItem[]>(`/${restaurantId}/menu`);
export const uploadRestaurantImage = (restaurantId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return restaurantService.post<string>(`/${restaurantId}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadMenuItemImage = (menuItemId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return restaurantService.post<string>(`/menu-items/${menuItemId}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Order Service
export const createOrder = (order: Omit<Order, 'id' | 'status' | 'date'>) => orderService.post<Order>('/', order);
export const getOrderById = (id: string) => orderService.get<Order>(`/${id}`);
export const getMyOrders = (customerId: string) => orderService.get<Order[]>(`/customer/${customerId}`);

// Delivery Service
export const getDeliveryStatus = (orderId: string) => deliveryService.get<Delivery>(`/order/${orderId}`);
export const updateDeliveryStatus = (id: string, status: string) => deliveryService.put<Delivery>(`/${id}/status`, { status });

// User Service
export const login = (credentials: {username: string, password: string}) => userService.post<User>('/login', credentials);
export const register = (userData: Omit<User, 'id'>) => userService.post<User>('/register', userData);
export const getUserById = (id: string) => userService.get<User>(`/${id}`);

