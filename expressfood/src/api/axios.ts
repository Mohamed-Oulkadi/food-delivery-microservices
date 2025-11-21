import axios from 'axios';

const createService = (port: number) => {
    return axios.create({
        baseURL: `http://localhost:${port}`,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const userService = createService(8084);
export const restaurantService = createService(8082);
export const orderService = createService(8081);
export const deliveryService = createService(8083);

// Add interceptors if needed (e.g., for auth tokens)
userService.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

orderService.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
