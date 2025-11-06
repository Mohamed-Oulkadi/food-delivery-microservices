import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Star, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { getRestaurantById, getMenuItems } from '../services/api';
import { MenuItem } from '../lib/mockData';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface RestaurantMenuProps {
  restaurantId: string;
  onNavigate: (page: string) => void;
}

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({ restaurantId, onNavigate }) => {
  const { addToCart } = useApp();
  // We'll treat backend responses as `any` and map to the frontend MenuItem type
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const [restaurantResponse, menuResponse] = await Promise.all([
          getRestaurantById(restaurantId),
          getMenuItems(restaurantId),
        ]);
        const r: any = restaurantResponse.data;
        setRestaurant(r);
        // Backend returns a Menu object { menuId, items: [...] } — normalize to an array
  const rawItems: any[] = (menuResponse.data as any)?.items ?? (menuResponse.data as any) ?? [];
        const mapped: MenuItem[] = (rawItems || []).map((mi: any) => ({
          id: String(mi.menuItemId ?? mi.id),
          restaurantId: String(r.restaurantId ?? r.id),
          name: mi.name,
          description: mi.description ?? '',
          price: typeof mi.price === 'number' ? mi.price : Number(mi.price) || 0,
          imageUrl: mi.imageUrl ?? ''
        }));
        setMenuItems(mapped);
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

  const handleAddToCart = (menuItem: MenuItem) => {
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
            <ImageWithFallback src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-auto rounded-lg" />
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
                    {item.imageUrl && <ImageWithFallback src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="w-2/3">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          <p className="text-green-600">${(item.price ?? 0).toFixed(2)}</p>
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
