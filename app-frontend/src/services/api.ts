
import axios from 'axios';
import { Restaurant, MenuItem, Order, UserDto, Delivery } from '../lib/mockData';

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
export const getMenuItems = (restaurantId: string) => restaurantService.get<Menu>(`/${restaurantId}/menu`);
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

export const deleteRestaurant = (id: string) => restaurantService.delete(`/${id}`);
export const createRestaurant = (restaurant: Omit<Restaurant, 'restaurantId' | 'imageUrl' | 'rating' | 'deliveryTime'>) => restaurantService.post<Restaurant>('', restaurant);
export const updateRestaurant = (id: string, restaurant: Partial<Restaurant>) => restaurantService.put<Restaurant>(`/${id}`, restaurant);
export const rateRestaurant = (restaurantId: string, rating: number) => restaurantService.put<Restaurant>(`/${restaurantId}/rate`, { rating });

// Order Service
export const createOrder = (order: Omit<Order, 'id' | 'status' | 'date'>) => orderService.post<Order>('', order);
export const getOrderById = (id: string) => orderService.get<Order>(`/${id}`);
export const getMyOrders = (customerId: string) => orderService.get<Order[]>(`/customer/${customerId}`);
export const getOrders = () => orderService.get<Order[]>('');
export const getOrderStats = () => orderService.get<{ totalOrders: number; pendingOrders: number; deliveredOrders: number }>('/stats');

// Delivery Service
export const getDeliveryStatus = (orderId: string) => deliveryService.get<Delivery>(`/order/${orderId}`);
export const updateDeliveryStatus = (id: string, status: string) => deliveryService.put<Delivery>(`/${id}/status`, { status });
export const getPendingDeliveries = () => deliveryService.get<Delivery[]>('/pending');
export const getDriverActiveDeliveries = (driverId: string | number) =>
  deliveryService.get<Delivery[]>(`/driver/${driverId}/active`);
export const assignDelivery = (id: string | number, driverId: string | number) =>
  deliveryService.put<Delivery>(`/${id}/assign`, { driverId });

// User Service
export const login = (credentials: {username: string, password: string}) => userService.post<UserDto>('/login', credentials);
export const register = (userData: Omit<UserDto, 'id'>) => userService.post<UserDto>('/register', userData);
export const getUsers = () => userService.get<UserDto[]>('');
export const getUserById = (id: string) => userService.get<UserDto>(`/${id}`);
export const updateUser = (id: number, userData: UserDto) => userService.put<UserDto>(`/${id}`, userData);
export const deleteUser = (id: number) => userService.delete(`/${id}`);
