export interface Restaurant {
    id: string | number;
    name: string;
    cuisine: string;
    rating: number;
    imageUrl?: string;
    address?: string;
    deliveryTime?: string;
    minimumOrder?: number;
}

export interface MenuItem {
    id: string | number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    restaurantId: string | number;
}

export interface CartItem extends MenuItem {
    quantity: number;
}

export interface User {
    id: string;
    email: string;
    name: string;
    username: string;
    role?: string;
    restaurantId?: number;
    phoneNumber?: string;
    address?: string;
    active?: boolean;
}

export interface Order {
    id: string;
    userId: string;
    restaurantId: string;
    items: CartItem[];
    totalAmount: number;
    status: 'PLACED' | 'ACCEPTED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'DELIVERING' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
}

export interface Delivery {
    id: string;
    deliveryId?: number; // Backend uses deliveryId
    orderId: string;
    status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED';
    currentLocation?: string;
    estimatedDeliveryTime?: string;
}
