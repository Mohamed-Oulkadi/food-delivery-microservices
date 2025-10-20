import axios from 'axios';
import type {Restaurant, RestaurantDto} from '../types';

// L'URL de base de votre microservice backend
const API_URL = 'http://localhost:8082/restaurants';

// Crée une instance d'Axios avec une configuration de base
const api = axios.create({
    baseURL: API_URL,
});

// Exporte des fonctions pour chaque opération CRUD
export const getRestaurants = () => api.get<Restaurant[]>('');

export const createRestaurant = (data: RestaurantDto) => api.post<Restaurant>('', data);

export const updateRestaurant = (id: string, data: RestaurantDto) => api.put<Restaurant>(`/${id}`, data);

export const deleteRestaurant = (id: string) => api.delete(`/${id}`);