import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, History, Calendar } from 'lucide-react';
import { orderService, deliveryService, restaurantService } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { Restaurant } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

interface OrderItem {
    menuItemId: number;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    customerId: number;
    restaurantId: number;
    totalAmount: number;
    status: string;
    date: string;
    deliveryAddress?: string;
    items: OrderItem[];
}

interface Delivery {
    deliveryId: number;
    orderId: number;
    driverId: number;
    status: string;
    pickupAddress?: string;
    deliveryAddress?: string;
    customerAddress?: string;
    restaurantName?: string;
    estimatedDeliveryTime?: string;
    actualDeliveryTime?: string;
}

const DriverDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'available' | 'active' | 'history'>('available');
    const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
    const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([]);
    const [deliveryHistory, setDeliveryHistory] = useState<Delivery[]>([]);
    const [restaurants, setRestaurants] = useState<Record<number, Restaurant>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user === null) {
            navigate('/login');
            return;
        }
        if (user && user.role !== 'ROLE_DRIVER') {
            navigate('/');
            return;
        }
        if (user) {
            fetchData();
            const interval = setInterval(fetchData, 10000);
            return () => clearInterval(interval);
        }
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Available Orders
            const ordersRes = await orderService.get('/api/orders');
            const available = (ordersRes.data || []).filter(
                (order: Order) => order.status === 'READY_FOR_PICKUP'
            );
            setAvailableOrders(available);

            // 2. Fetch Active Deliveries
            try {
                const activeRes = await deliveryService.get(`/api/deliveries/driver/${user?.id}/active`);
                setActiveDeliveries(activeRes.data || []);
            } catch (err) {
                console.log('No active deliveries:', err);
                setActiveDeliveries([]);
            }

            // 3. Fetch Delivery History
            try {
                const historyRes = await deliveryService.get(`/api/deliveries/driver/${user?.id}`);
                const history = (historyRes.data || []).filter(
                    (d: Delivery) => d.status === 'DELIVERED' || d.status === 'COMPLETED' || d.status === 'CANCELLED'
                );
                setDeliveryHistory(history);
            } catch (err) {
                console.log('No delivery history:', err);
                setDeliveryHistory([]);
            }

            // 4. Fetch Restaurant Details
            const restaurantIds = new Set<number>();
            available.forEach((o: Order) => restaurantIds.add(o.restaurantId));
            // Add IDs from active deliveries if they have them (though delivery object might not have restaurantId directly, usually it's on the order)
            // For simplicity, we'll fetch for available orders first. 
            // If active deliveries need it, we might need to fetch order details for them too if not present.

            const newRestaurants: Record<number, Restaurant> = { ...restaurants };
            let hasNew = false;

            for (const id of restaurantIds) {
                if (!newRestaurants[id]) {
                    try {
                        const res = await restaurantService.get(`/api/restaurants/${id}`);
                        newRestaurants[id] = res.data;
                        hasNew = true;
                    } catch (err) {
                        console.error(`Failed to fetch restaurant ${id}`, err);
                    }
                }
            }

            if (hasNew) {
                setRestaurants(newRestaurants);
            }

        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const acceptOrder = async (orderId: number) => {
        try {
            const deliveryRes = await deliveryService.get(`/api/deliveries/order/${orderId}`);
            const delivery = deliveryRes.data;
            await deliveryService.put(`/api/deliveries/${delivery.deliveryId}/assign`, {
                driverId: user?.id
            });
            fetchData();
            setActiveTab('active'); // Switch to active tab
        } catch (err) {
            console.error('Failed to accept order:', err);
        }
    };

    const updateDeliveryStatus = async (deliveryId: number, status: string) => {
        try {
            await deliveryService.put(`/api/deliveries/${deliveryId}/status`, { status });
            fetchData();
        } catch (err) {
            console.error('Failed to update delivery status:', err);
        }
    };

    const getStatusBadge = (status: string) => {
        const config = {
            ACCEPTED: { color: 'bg-blue-100 text-blue-800', icon: Clock },
            PICKED_UP: { color: 'bg-purple-100 text-purple-800', icon: Truck },
            IN_TRANSIT: { color: 'bg-indigo-100 text-indigo-800', icon: Truck },
            DELIVERED: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
            COMPLETED: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
            CANCELLED: { color: 'bg-red-100 text-red-800', icon: CheckCircle },
        };

        const statusConfig = config[status as keyof typeof config] || config.ACCEPTED;
        const Icon = statusConfig.icon;

        return (
            <Badge className={`${statusConfig.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {status}
            </Badge>
        );
    };

    if (loading && availableOrders.length === 0 && activeDeliveries.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-6xl mx-auto animate-pulse space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>

                {/* Tabs Navigation */}
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-8 w-full md:w-auto inline-flex">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'available'
                            ? 'bg-white text-emerald-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                    >
                        <Package className="h-4 w-4" />
                        Available Orders
                        {availableOrders.length > 0 && (
                            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full ml-1">
                                {availableOrders.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'active'
                            ? 'bg-white text-emerald-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                    >
                        <Truck className="h-4 w-4" />
                        Active Deliveries
                        {activeDeliveries.length > 0 && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full ml-1">
                                {activeDeliveries.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'history'
                            ? 'bg-white text-emerald-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                    >
                        <History className="h-4 w-4" />
                        Delivery History
                    </button>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {/* AVAILABLE ORDERS TAB */}
                    {activeTab === 'available' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Package className="h-5 w-5 text-emerald-600" />
                                New Orders
                            </h2>
                            {availableOrders.length === 0 ? (
                                <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
                                    <CardContent className="p-12 text-center text-slate-500">
                                        <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                        <p className="font-medium">No orders available right now</p>
                                        <p className="text-sm mt-1">Check back soon for new delivery opportunities</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {availableOrders.map(order => (
                                        <Card key={order.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                                Order #{order.id}
                                                            </Badge>
                                                            <span className="text-xs text-slate-500">2 mins ago</span>
                                                        </div>
                                                        <h3 className="font-bold text-lg">{restaurants[order.restaurantId]?.name || 'Loading...'}</h3>
                                                        <p className="text-sm text-slate-500 mb-2">{restaurants[order.restaurantId]?.address || 'Loading address...'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-emerald-600">${(order.totalAmount * 0.15).toFixed(2)}</p>
                                                        <p className="text-xs text-slate-400">Est. Earnings</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 mb-6">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1">
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">Pickup</p>
                                                            <p className="text-sm text-slate-500">{restaurants[order.restaurantId]?.name || 'Restaurant'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1">
                                                            <div className="h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">Dropoff</p>
                                                            <p className="text-sm text-slate-500">{order.deliveryAddress || 'Customer Address'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                    <div className="flex gap-4 text-sm text-slate-500">
                                                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> 2.5 km</span>
                                                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 15 min</span>
                                                    </div>
                                                    <Button
                                                        onClick={() => acceptOrder(order.id)}
                                                        disabled={activeDeliveries.length > 0}
                                                        className="bg-emerald-600 hover:bg-emerald-700"
                                                    >
                                                        Accept Order
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ACTIVE DELIVERIES TAB */}
                    {activeTab === 'active' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Truck className="h-5 w-5 text-blue-600" />
                                Current Deliveries
                            </h2>
                            {activeDeliveries.length === 0 ? (
                                <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
                                    <CardContent className="p-12 text-center text-slate-500">
                                        <Truck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                        <p className="font-medium">No active deliveries</p>
                                        <p className="text-sm mt-1">Accept an order from the Available tab to get started</p>
                                        <Button variant="outline" className="mt-4" onClick={() => setActiveTab('available')}>
                                            Find Orders
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-6">
                                    {activeDeliveries.map(delivery => (
                                        <Card key={delivery.deliveryId} className="overflow-hidden border-none shadow-lg">
                                            <div className="bg-slate-900 text-white p-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                                                                Order #{delivery.orderId}
                                                            </Badge>
                                                            {getStatusBadge(delivery.status)}
                                                        </div>
                                                        <h3 className="text-2xl font-bold">Customer Name</h3>
                                                    </div>
                                                    <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-none">
                                                        Contact Customer
                                                    </Button>
                                                </div>
                                            </div>
                                            <CardContent className="p-0">
                                                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                                    <div className="p-6 col-span-2 space-y-6">
                                                        <div className="flex gap-4">
                                                            <div className="flex flex-col items-center">
                                                                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                                                <div className="w-0.5 h-full bg-slate-200 my-1" />
                                                                <div className="h-3 w-3 rounded-full bg-blue-500" />
                                                            </div>
                                                            <div className="space-y-6 flex-1">
                                                                <div>
                                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup</p>
                                                                    <p className="font-medium text-lg">{delivery.restaurantName || 'Restaurant Name'}</p>
                                                                    <p className="text-slate-500">123 Restaurant St, City</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dropoff</p>
                                                                    <p className="font-medium text-lg">{delivery.customerAddress || 'Customer Address'}</p>
                                                                    <p className="text-slate-500">Note: Please leave at door</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                                                            {delivery.status === 'ACCEPTED' && (
                                                                <Button
                                                                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                                                                    onClick={() => updateDeliveryStatus(delivery.deliveryId, 'PICKED_UP')}
                                                                >
                                                                    <Package className="h-4 w-4 mr-2" />
                                                                    Confirm Pickup
                                                                </Button>
                                                            )}
                                                            {(delivery.status === 'PICKED_UP' || delivery.status === 'IN_TRANSIT') && (
                                                                <Button
                                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                                                    onClick={() => updateDeliveryStatus(delivery.deliveryId, 'DELIVERED')}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                                    Mark Delivered
                                                                </Button>
                                                            )}
                                                            {delivery.status === 'DELIVERED' && (
                                                                <div className="flex-1 bg-amber-50 text-amber-700 rounded-lg p-3 flex items-center justify-center gap-2 font-medium">
                                                                    <Clock className="h-5 w-5" />
                                                                    Waiting for customer confirmation...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="p-6 bg-slate-50">
                                                        <h4 className="font-bold mb-4">Order Details</h4>
                                                        <div className="space-y-3 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-500">Est. Arrival</span>
                                                                <span className="font-medium">12:45 PM</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-500">Distance</span>
                                                                <span className="font-medium">3.2 km</span>
                                                            </div>
                                                            <div className="flex justify-between pt-3 border-t border-slate-200">
                                                                <span className="font-bold">Expected Pay</span>
                                                                <span className="font-bold text-emerald-600">$12.50</span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-6 h-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                                                            Map Placeholder
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* HISTORY TAB */}
                    {activeTab === 'history' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <History className="h-5 w-5 text-slate-600" />
                                    Delivery History
                                </h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Filter Date
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Export
                                    </Button>
                                </div>
                            </div>

                            {deliveryHistory.length === 0 ? (
                                <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
                                    <CardContent className="p-12 text-center text-slate-500">
                                        <History className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                        <p className="font-medium">No delivery history yet</p>
                                        <p className="text-sm mt-1">Completed deliveries will appear here</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4">Date & Time</th>
                                                <th className="px-6 py-4">Order ID</th>
                                                <th className="px-6 py-4">Restaurant</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Earnings</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {deliveryHistory.map(delivery => (
                                                <tr key={delivery.deliveryId} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium">Today</div>
                                                        <div className="text-slate-500 text-xs">12:30 PM</div>
                                                    </td>
                                                    <td className="px-6 py-4">#{delivery.orderId}</td>
                                                    <td className="px-6 py-4">{delivery.restaurantName || 'Restaurant'}</td>
                                                    <td className="px-6 py-4">{getStatusBadge(delivery.status)}</td>
                                                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                                                        $12.50
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
