import axios from 'axios';

const API_BASE_URL = 'http://localhost';

// Order Service runs on port 8081
const orderServiceApi = axios.create({
    baseURL: `${API_BASE_URL}:8081/api`,
});

// Restaurant Service runs on port 8082
const restaurantServiceApi = axios.create({
    baseURL: `${API_BASE_URL}:8082/api`,
});

// Restaurant Owner API Functions

// Order Management
export const getRestaurantOrders = async (restaurantId: number | string) => {
    const response = await orderServiceApi.get(`/orders/restaurant/${restaurantId}`);
    return response.data;
};

export const updateOrderStatus = async (orderId: number | string, status: string) => {
    const response = await orderServiceApi.put(`/orders/${orderId}/status`, { status });
    return response.data;
};

// Restaurant Management
export const getRestaurantDetails = async (restaurantId: number | string) => {
    const response = await restaurantServiceApi.get(`/restaurants/${restaurantId}`);
    return response.data;
};

export const updateRestaurant = async (restaurantId: number | string, restaurantData: any) => {
    const response = await restaurantServiceApi.put(`/restaurants/${restaurantId}`, restaurantData);
    return response.data;
};

// Menu Management
export const getRestaurantMenu = async (restaurantId: number | string) => {
    const response = await restaurantServiceApi.get(`/restaurants/${restaurantId}/menu`);
    // Map backend 'available' field to frontend 'isAvailable' field
    if (response.data && response.data.items) {
        response.data.items = response.data.items.map((item: any) => ({
            ...item,
            isAvailable: item.available !== undefined ? item.available : item.isAvailable
        }));
    }
    return response.data;
};

export const addMenuItem = async (restaurantId: number | string, menuItem: any) => {
    // Map frontend 'isAvailable' field to backend 'available' field
    const backendMenuItem = {
        ...menuItem,
        available: menuItem.isAvailable !== undefined ? menuItem.isAvailable : menuItem.available
    };
    delete backendMenuItem.isAvailable;
    const response = await restaurantServiceApi.post(`/restaurants/${restaurantId}/menu/items`, backendMenuItem);
    return response.data;
};

export const updateMenuItem = async (restaurantId: number | string, menuItemId: number | string, menuItem: any) => {
    // Map frontend 'isAvailable' field to backend 'available' field
    const backendMenuItem = {
        ...menuItem,
        available: menuItem.isAvailable !== undefined ? menuItem.isAvailable : menuItem.available
    };
    delete backendMenuItem.isAvailable;
    const response = await restaurantServiceApi.put(`/restaurants/${restaurantId}/menu/items/${menuItemId}`, backendMenuItem);
    return response.data;
};

export const deleteMenuItem = async (restaurantId: number | string, menuItemId: number | string) => {
    await restaurantServiceApi.delete(`/restaurants/${restaurantId}/menu/items/${menuItemId}`);
};

export const deleteRestaurant = async (restaurantId: number | string) => {
    await restaurantServiceApi.delete(`/restaurants/${restaurantId}`);
};
