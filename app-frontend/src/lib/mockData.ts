export interface Restaurant {
  id: string;
  name: string;
  cuisineType: string;
  address: string;
  image: string;
  rating: number;
  deliveryTime: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  items: { menuItem: MenuItem; quantity: number }[];
  totalAmount: number;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
  date: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  customerAddress: string;
  restaurantName: string;
  status: 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';
  driverId?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ROLE_CUSTOMER' | 'ROLE_ADMIN' | 'ROLE_DRIVER';
}

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: "Amici's Italian Kitchen",
    cuisineType: 'Italian',
    address: '123 Main St, Downtown',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    rating: 4.5,
    deliveryTime: '30-40 min'
  },
  {
    id: '2',
    name: 'Spice of India',
    cuisineType: 'Indian',
    address: '456 Oak Ave, Midtown',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    rating: 4.7,
    deliveryTime: '25-35 min'
  },
  {
    id: '3',
    name: 'Sushi Paradise',
    cuisineType: 'Japanese',
    address: '789 Pine Rd, Eastside',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    rating: 4.8,
    deliveryTime: '35-45 min'
  },
  {
    id: '4',
    name: 'Burger Haven',
    cuisineType: 'American',
    address: '321 Elm St, Westside',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    rating: 4.3,
    deliveryTime: '20-30 min'
  },
  {
    id: '5',
    name: 'Green Garden',
    cuisineType: 'Vegetarian',
    address: '654 Maple Dr, Northside',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    rating: 4.6,
    deliveryTime: '25-35 min'
  },
  {
    id: '6',
    name: 'Dragon Wok',
    cuisineType: 'Chinese',
    address: '987 Cedar Ln, Southside',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800',
    rating: 4.4,
    deliveryTime: '30-40 min'
  }
];

export const mockMenuItems: MenuItem[] = [
  // Amici's Italian Kitchen
  { id: 'm1', restaurantId: '1', name: 'Margherita Pizza', description: 'Classic tomato sauce, mozzarella, and fresh basil', price: 12.99 },
  { id: 'm2', restaurantId: '1', name: 'Fettuccine Alfredo', description: 'Creamy parmesan sauce with fettuccine pasta', price: 14.99 },
  { id: 'm3', restaurantId: '1', name: 'Caesar Salad', description: 'Romaine lettuce, croutons, parmesan, and Caesar dressing', price: 8.99 },
  { id: 'm4', restaurantId: '1', name: 'Tiramisu', description: 'Classic Italian dessert with coffee-soaked ladyfingers', price: 6.99 },
  
  // Spice of India
  { id: 'm5', restaurantId: '2', name: 'Chicken Tikka Masala', description: 'Tender chicken in a creamy tomato-based curry', price: 15.99 },
  { id: 'm6', restaurantId: '2', name: 'Vegetable Biryani', description: 'Fragrant basmati rice with mixed vegetables and spices', price: 13.99 },
  { id: 'm7', restaurantId: '2', name: 'Garlic Naan', description: 'Freshly baked flatbread with garlic and butter', price: 3.99 },
  { id: 'm8', restaurantId: '2', name: 'Mango Lassi', description: 'Sweet yogurt-based drink with mango', price: 4.99 },
  
  // Sushi Paradise
  { id: 'm9', restaurantId: '3', name: 'California Roll', description: 'Crab, avocado, and cucumber roll', price: 8.99 },
  { id: 'm10', restaurantId: '3', name: 'Spicy Tuna Roll', description: 'Fresh tuna with spicy mayo', price: 10.99 },
  { id: 'm11', restaurantId: '3', name: 'Salmon Nigiri', description: 'Fresh salmon over pressed rice (2 pieces)', price: 6.99 },
  { id: 'm12', restaurantId: '3', name: 'Miso Soup', description: 'Traditional Japanese soup with tofu and seaweed', price: 3.99 },
  
  // Burger Haven
  { id: 'm13', restaurantId: '4', name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, onion, and special sauce', price: 11.99 },
  { id: 'm14', restaurantId: '4', name: 'Bacon Cheeseburger', description: 'Double beef patty with bacon and cheddar cheese', price: 14.99 },
  { id: 'm15', restaurantId: '4', name: 'French Fries', description: 'Crispy golden fries', price: 4.99 },
  { id: 'm16', restaurantId: '4', name: 'Milkshake', description: 'Creamy vanilla milkshake', price: 5.99 },
  
  // Green Garden
  { id: 'm17', restaurantId: '5', name: 'Buddha Bowl', description: 'Quinoa, roasted vegetables, and tahini dressing', price: 12.99 },
  { id: 'm18', restaurantId: '5', name: 'Veggie Wrap', description: 'Hummus, mixed greens, and fresh vegetables', price: 9.99 },
  { id: 'm19', restaurantId: '5', name: 'Avocado Toast', description: 'Multigrain bread with smashed avocado and seeds', price: 8.99 },
  { id: 'm20', restaurantId: '5', name: 'Green Smoothie', description: 'Spinach, banana, mango, and coconut water', price: 6.99 },
  
  // Dragon Wok
  { id: 'm21', restaurantId: '6', name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts and vegetables', price: 13.99 },
  { id: 'm22', restaurantId: '6', name: 'Beef Lo Mein', description: 'Stir-fried noodles with beef and vegetables', price: 12.99 },
  { id: 'm23', restaurantId: '6', name: 'Spring Rolls', description: 'Crispy vegetable spring rolls (4 pieces)', price: 5.99 },
  { id: 'm24', restaurantId: '6', name: 'Fried Rice', description: 'Classic fried rice with egg and vegetables', price: 7.99 }
];

export const mockUsers: User[] = [
  { id: 'u1', username: 'customer1', email: 'customer@example.com', role: 'ROLE_CUSTOMER' },
  { id: 'u2', username: 'admin', email: 'admin@example.com', role: 'ROLE_ADMIN' },
  { id: 'u3', username: 'driver1', email: 'driver@example.com', role: 'ROLE_DRIVER' }
];
