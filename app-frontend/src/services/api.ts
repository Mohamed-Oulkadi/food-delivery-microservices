
import axios from 'axios';
import { Restaurant, MenuItem, Order, User, Delivery } from '../lib/mockData';

const API_BASE_URL = 'http://localhost';

const restaurantService = axios.create({
  baseURL: `${API_BASE_URL}:8082/api/restaurants`,
});

const orderService = axios.create({
  baseURL: `${API_BASE_URL}:8081/api/orders`,
});

const deliveryService = axios.create({
  baseURL: `${API_BASE_URL}:8083/api/deliveries`,
});

const userService = axios.create({
  baseURL: `${API_BASE_URL}:8084/api/users`,
});

// Restaurant Service
export const getRestaurants = () => restaurantService.get<Restaurant[]>('');
export const getRestaurantById = (id: string) => restaurantService.get<Restaurant>(`/${id}`);
export const getMenuItems = (restaurantId: string) => restaurantService.get<MenuItem[]>(`/${restaurantId}/menu`);

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

