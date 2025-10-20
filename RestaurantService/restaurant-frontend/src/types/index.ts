export interface Restaurant {
    restaurantId: string;
    name: string;
    cuisineType: string;
}

export type RestaurantDto = Omit<Restaurant, 'restaurantId'>;