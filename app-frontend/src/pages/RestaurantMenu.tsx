import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Star, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { getRestaurantById, getMenuItems } from '../services/api';
import { Restaurant, MenuItem } from '../lib/mockData';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface RestaurantMenuProps {
  restaurantId: string;
  onNavigate: (page: string) => void;
}

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({ restaurantId, onNavigate }) => {
  const { addToCart } = useApp();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const [restaurantResponse, menuResponse] = await Promise.all([
          getRestaurantById(restaurantId),
          getMenuItems(restaurantId),
        ]);
        setRestaurant(restaurantResponse.data);
        setMenuItems(menuResponse.data);
      } catch (error) {
        console.error('Failed to fetch restaurant details', error);
      }
    };
    fetchRestaurantDetails();
  }, [restaurantId]);
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Restaurant not found</p>
          <Button onClick={() => onNavigate('home')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (menuItem: typeof menuItems[0]) => {
    addToCart(menuItem);
    toast.success(`${menuItem.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => onNavigate('home')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Restaurants
        </Button>

        {/* Restaurant Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 flex items-center">
          <div className="w-1/3 mr-6">
            <img src={restaurant.imageUrl && !restaurant.imageUrl.startsWith('http') ? `http://localhost:8082${restaurant.imageUrl}` : restaurant.imageUrl} alt={restaurant.name} className="w-full h-auto rounded-lg" />
          </div>
          <div>
            <h1 className="text-gray-900 mb-2">{restaurant.name}</h1>
            <p className="text-gray-600 mb-4">{restaurant.cuisineType}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-6">
          <h2 className="text-gray-900">Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-1/3">
                    {item.imageUrl && <img src={item.imageUrl && !item.imageUrl.startsWith('http') ? `http://localhost:8082${item.imageUrl}` : item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="w-2/3">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          <p className="text-green-600">${item.price.toFixed(2)}</p>
                        </div>
                        <Button
                          className="bg-green-600 hover:bg-green-700 shrink-0"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {menuItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No menu items available for this restaurant.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
