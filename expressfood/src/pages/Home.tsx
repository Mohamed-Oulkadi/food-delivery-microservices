import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, Filter } from 'lucide-react';
import { restaurantService } from '../api/axios';
import type { Restaurant } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await restaurantService.get('/api/restaurants');
                setRestaurants(response.data);
            } catch (err) {
                console.error('Failed to fetch restaurants:', err);
                // Fallback mock data for demo purposes if backend is not running
                setRestaurants([
                    {
                        id: '1',
                        name: 'Burger King',
                        cuisineType: 'American',
                        rating: 4.5,
                        imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
                        address: '123 Main St',
                        deliveryTime: '20-30 min',
                        minimumOrder: 10
                    },
                    {
                        id: '2',
                        name: 'Sushi Master',
                        cuisineType: 'Japanese',
                        rating: 4.8,
                        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
                        address: '456 Oak Ave',
                        deliveryTime: '30-45 min',
                        minimumOrder: 15
                    },
                    {
                        id: '3',
                        name: 'Pizza Hut',
                        cuisineType: 'Italian',
                        rating: 4.2,
                        imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80',
                        address: '789 Pine Rd',
                        deliveryTime: '25-40 min',
                        minimumOrder: 12
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <div className="space-y-8 pb-20">
            {/* Hero Section */}
            <section className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-slate-900">
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
                    alt="Food Hero"
                    className="absolute inset-0 h-full w-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Delicious Food,<br />Delivered To You
                    </h1>
                    <p className="text-lg text-slate-200 mb-8 max-w-xl">
                        Choose from thousands of restaurants and get your favorite meals delivered to your doorstep in minutes.
                    </p>
                    <div className="flex gap-4">
                        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                            Find Food Near You
                        </Button>
                    </div>
                </div>
            </section>

            {/* Restaurant Grid */}
            <section className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold">Popular Restaurants</h2>

                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Filter by:</span>
                        <select
                            value={selectedCuisine}
                            onChange={(e) => setSelectedCuisine(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="All">All Cuisines</option>
                            {Array.from(new Set(restaurants.map(r => r.cuisineType))).sort().map(cuisine => (
                                <option key={cuisine} value={cuisine}>{cuisine}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 rounded-xl bg-slate-200 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurants
                            .filter(r => selectedCuisine === 'All' || r.cuisineType === selectedCuisine)
                            .map((restaurant) => (
                                <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full border-none shadow-md">
                                        <div className="relative h-48 w-full">
                                            <img
                                                src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'}
                                                alt={restaurant.name}
                                                className="h-full w-full object-cover"
                                            />
                                            <Badge className="absolute top-4 right-4 bg-white/90 text-slate-900 backdrop-blur-sm">
                                                {restaurant.cuisineType}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold">{restaurant.name}</h3>
                                                <div className="flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded-lg">
                                                    <Star className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                                                    <span className="text-sm font-bold text-emerald-700">{restaurant.rating}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-slate-500 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{restaurant.deliveryTime || '20-30 min'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{restaurant.address || '1.2 km away'}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                    </div>
                )}
            </section>
        </div>
    );
};
