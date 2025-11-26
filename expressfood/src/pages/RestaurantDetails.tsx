import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, MapPin, Plus } from 'lucide-react';
import { restaurantService } from '../api/axios';
import type { Restaurant, MenuItem } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useCart } from '../context/CartContext';

export const RestaurantDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch actual restaurant details from backend
                const restaurantRes = await restaurantService.get(`/api/restaurants/${id}`);
                setRestaurant(restaurantRes.data);

                const menuRes = await restaurantService.get(`/api/restaurants/${id}/menu`);
                // Backend returns a Menu object with an items array
                // We need to inject restaurantId into each item because the backend entity doesn't have it
                const itemsWithRestaurantId = (menuRes.data.items || []).map((item: any) => ({
                    ...item,
                    restaurantId: id
                }));
                setMenu(itemsWithRestaurantId);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                // Mock menu data
                setMenu([
                    { id: '101', name: 'Whopper Meal', description: 'Flame-grilled beef patty with fries and drink', price: 12.99, restaurantId: id!, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
                    { id: '102', name: 'Chicken Royale', description: 'Crispy chicken breast with lettuce and mayo', price: 10.99, restaurantId: id!, imageUrl: 'https://images.unsplash.com/photo-1615557960916-5f4791effe9d?w=800&q=80' },
                    { id: '103', name: 'Cheeseburger', description: 'Classic cheeseburger with pickles', price: 5.99, restaurantId: id!, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80' },
                    { id: '104', name: 'Fries (Large)', description: 'Golden crispy fries', price: 3.99, restaurantId: id!, imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&q=80' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!restaurant) return <div className="p-8 text-center">Restaurant not found</div>;

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="relative h-[300px] w-full">
                <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="container mx-auto">
                        <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                        <div className="flex items-center gap-6 text-sm font-medium">
                            <span className="bg-emerald-600 px-3 py-1 rounded-full">{restaurant.cuisine}</span>
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{restaurant.rating} (500+ ratings)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>20-30 min</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{restaurant.address}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6">Menu</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menu.map((item) => (
                        <Card key={item.id} className="flex overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-32 h-32 shrink-0">
                                <img
                                    src={item.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex-1 p-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <span className="font-semibold text-emerald-600">${item.price.toFixed(2)}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <Button
                                        size="sm"
                                        className="rounded-full"
                                        onClick={() => addToCart(item)}
                                    >
                                        Add <Plus className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
