import axios from 'axios';
import type {Restaurant, RestaurantDto, Menu} from '../types'; // <-- Import Menu
// <-- Import Menu

// The base URL of your microservice backend
const API_URL = 'http://localhost:8082/restaurants';

const api = axios.create({
    baseURL: API_URL,
});

// Functions for interacting with the API
export const getRestaurants = () => api.get<Restaurant[]>('');
export const createRestaurant = (data: RestaurantDto) => api.post<Restaurant>('', data);
export const updateRestaurant = (id: string, data: RestaurantDto) => api.put<Restaurant>(`/${id}`, data);
export const deleteRestaurant = (id: string) => api.delete(`/${id}`);

export const getMenuForRestaurant = (id: string) => api.get<Menu>(`/${id}/menu`);