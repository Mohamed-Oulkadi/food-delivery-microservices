import React, { useEffect, useState } from 'react';
import { Users, Store, Truck, Package, TrendingUp, DollarSign } from 'lucide-react';
import { orderService } from '../api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

interface AdminStats {
    totalCustomers: number;
    totalDrivers: number;
    totalRestaurants: number;
    totalOrders: number;
    ordersPreparing: number;
    ordersOutForDelivery: number;
    ordersDelivered: number;
    ordersCompleted: number;
    ordersCancelled: number;
    todayOrders: number;
    todayRevenue: number;
    weekOrders: number;
    weekRevenue: number;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch data from multiple services concurrently
            const [statsResponse, usersResponse, restaurantsResponse] = await Promise.all([
                orderService.get<AdminStats>('/api/orders/admin/stats'),
                orderService.get('/api/users', { baseURL: 'http://localhost:8084' }).catch(() => ({ data: [] })),
                orderService.get('/api/restaurants', { baseURL: 'http://localhost:8082' }).catch(() => ({ data: [] }))
            ]);

            const statsData = statsResponse.data;
            const users = usersResponse.data || [];
            const restaurants = restaurantsResponse.data || [];

            // Count users by role
            const customers = users.filter((u: any) => u.role === 'ROLE_CUSTOMER').length;
            const drivers = users.filter((u: any) => u.role === 'ROLE_DRIVER').length;

            // Update stats with real counts
            setStats({
                ...statsData,
                totalCustomers: customers,
                totalDrivers: drivers,
                totalRestaurants: restaurants.length
            });
        } catch (err) {
            console.error('Failed to fetch admin stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-slate-200 rounded-xl" />
                ))}
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Customers',
            value: stats?.totalCustomers || 0,
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Total Drivers',
            value: stats?.totalDrivers || 0,
            icon: Truck,
            color: 'bg-emerald-500',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600'
        },
        {
            title: 'Partner Restaurants',
            value: stats?.totalRestaurants || 0,
            icon: Store,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: Package,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
    ];

    const orderStatusCards = [
        {
            title: 'Preparing',
            value: stats?.ordersPreparing || 0,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600'
        },
        {
            title: 'Out for Delivery',
            value: stats?.ordersOutForDelivery || 0,
            color: 'bg-indigo-500',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-600'
        },
        {
            title: 'Delivered',
            value: stats?.ordersDelivered || 0,
            color: 'bg-emerald-500',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600'
        },
        {
            title: 'Completed',
            value: stats?.ordersCompleted || 0,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
    ];

    return (
        <div className="space-y-6">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="border-none shadow-md hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                                        <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                        <Icon className={`h-6 w-6 ${stat.textColor}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Order Status Breakdown */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Orders by Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {orderStatusCards.map((stat) => (
                            <div key={stat.title} className={`${stat.bgColor} p-4 rounded-lg border-l-4 ${stat.color}`}>
                                <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                            Today's Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Orders Today</span>
                            <span className="text-2xl font-bold text-slate-900">{stats?.todayOrders || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <span className="text-slate-600">Revenue Today</span>
                            <span className="text-2xl font-bold text-emerald-600">
                                ${(stats?.todayRevenue || 0).toFixed(2)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                            This Week's Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Orders This Week</span>
                            <span className="text-2xl font-bold text-slate-900">{stats?.weekOrders || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <span className="text-slate-600">Revenue This Week</span>
                            <span className="text-2xl font-bold text-blue-600">
                                ${(stats?.weekRevenue || 0).toFixed(2)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
