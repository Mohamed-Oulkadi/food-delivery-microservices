// Interface for a restaurant complete (as received from the backend)
export interface Restaurant {
    restaurantId: string;
    name: string;
    cuisineType: string;
}

// DTO (Data Transfer Object) for creating/updating a restaurant
export type RestaurantDto = Omit<Restaurant, 'restaurantId'>;

export interface MenuItem {
    menuItemId: string;
    name: string;
    description: string;
    price: number;
    isAvailable: boolean;
}

export interface Menu {
    menuId: string;
    items: MenuItem[];
}