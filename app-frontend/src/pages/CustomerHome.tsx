import { useState, useEffect } from 'react';
import { Search, Star, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { getRestaurants } from '../services/api';
import { Restaurant, mockRestaurants } from '../lib/mockData';
import { toast } from 'sonner';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface CustomerHomeProps {
  onNavigate: (page: string, restaurantId?: string) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({ onNavigate }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await getRestaurants();
        setRestaurants(response.data);
      } catch (error) {
        console.error('Failed to fetch restaurants', error);
        // Fallback to local mock data so the UI is usable when backend is down
        setRestaurants(mockRestaurants);
        toast.error('Could not load restaurants from backend — showing mock data');
      }
    };
    fetchRestaurants();
  }, []);

  const cuisineTypes = ['all', ...new Set(restaurants.map(r => r.cuisineType))];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          restaurant.cuisineType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = cuisineFilter === 'all' || restaurant.cuisineType === cuisineFilter;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-4">Order Food from Your Favorite Restaurants</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover delicious meals delivered to your door. Fresh, fast, and hassle-free.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search restaurants or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Cuisine Type" />
            </SelectTrigger>
            <SelectContent>
              {cuisineTypes.map(cuisine => (
                <SelectItem key={cuisine} value={cuisine}>
                  {cuisine === 'all' ? 'All Cuisines' : cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <Card
              key={restaurant.restaurantId}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onNavigate('restaurant', restaurant.restaurantId)}
            >
              <div className="aspect-[16/9] overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-gray-900 mb-1">{restaurant.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{restaurant.cuisineType}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>{typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : '—'}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{restaurant.deliveryTime ?? 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No restaurants found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
