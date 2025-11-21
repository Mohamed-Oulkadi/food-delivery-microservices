import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { orderService } from '../api/axios';
import { useAuth } from '../context/AuthContext';
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
    items: OrderItem[];
}

type FilterType = 'all' | 'active' | 'delivered';

const MyOrders: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            console.log('Fetching orders for user:', user?.id);
            const response = await orderService.get(`/api/orders/customer/${user?.id}`);
            console.log('Orders response:', response.data);

            // Log each order's details
            response.data?.forEach((order: Order) => {
                console.log(`Order #${order.id} - Status: ${order.status}, Total: $${order.totalAmount}`);
            });

            setOrders(response.data || []);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const markAsReceived = async (orderId: number) => {
        try {
            console.log('Marking order as received:', orderId);

            // 1. Update Order Service
            const response = await orderService.put(`/api/orders/${orderId}/status`, { status: 'COMPLETED' });
            console.log('Order status update response:', response);

            // 2. Also try to update Delivery Service if possible, but Order Service is primary here for user record
            // Ideally Order Service should sync this, but for now we update Order status.

            // Refresh orders
            await fetchOrders();
            console.log('Orders refreshed after marking as received');
        } catch (err) {
            console.error('Failed to mark order as received:', err);
            alert('Failed to mark order as received. Please check the console for details.');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
            PREPARING: { color: 'bg-purple-100 text-purple-800', icon: Package },
            IN_TRANSIT: { color: 'bg-indigo-100 text-indigo-800', icon: Package },
            DELIVERED: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
            COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {status}
            </Badge>
        );
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'active') return !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(order.status);
        if (filter === 'delivered') return ['DELIVERED', 'COMPLETED'].includes(order.status);
        return true;
    });

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-slate-200 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">My Orders</h1>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-200">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 font-medium transition-colors ${filter === 'all'
                            ? 'text-emerald-600 border-b-2 border-emerald-600'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        All Orders
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 font-medium transition-colors ${filter === 'active'
                            ? 'text-emerald-600 border-b-2 border-emerald-600'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter('delivered')}
                        className={`px-4 py-2 font-medium transition-colors ${filter === 'delivered'
                            ? 'text-emerald-600 border-b-2 border-emerald-600'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Delivered
                    </button>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-700 mb-2">
                            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
                        </h2>
                        <p className="text-slate-500 mb-6">
                            {filter === 'all'
                                ? 'Start ordering delicious food from your favorite restaurants!'
                                : `You don't have any ${filter} orders at the moment.`
                            }
                        </p>
                        {filter === 'all' && (
                            <Button onClick={() => navigate('/')} className="bg-emerald-600 hover:bg-emerald-700">
                                Browse Restaurants
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map(order => (
                            <Card key={order.id} className="hover:shadow-lg transition-shadow border-none shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold">Order #{order.id}</h3>
                                                {getStatusBadge(order.status)}
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                {new Date(order.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-emerald-600">
                                                ${order.totalAmount.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 flex-wrap">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => navigate(`/track/${order.id}`)}
                                            className="flex items-center gap-1"
                                        >
                                            Track Order
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>

                                        {order.status === 'DELIVERED' && (
                                            <Button
                                                size="sm"
                                                onClick={() => markAsReceived(order.id)}
                                                className="bg-emerald-600 hover:bg-emerald-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Mark as Received
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
