import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link, Routes, Route, Navigate } from 'react-router-dom';
import {
    Package,
    ChefHat,
    CheckCircle,
    Store,
    UtensilsCrossed,
    Plus,
    Edit2,
    Trash2,
    LayoutDashboard,
    Users,
    DollarSign,
    TrendingUp,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
    getRestaurantOrders,
    updateOrderStatus,
    getRestaurantDetails,
    updateRestaurant,
    getRestaurantMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    deleteRestaurant
} from '../api/restaurantOwnerApi';

interface Order {
    id: string;
    userId: string;
    restaurantId: string;
    totalAmount: number;
    status: string;
    date: string;
    items: any[];
}

interface Restaurant {
    id: number;
    restaurantId?: number;
    name: string;
    cuisineType: string;
    imageUrl: string;
    rating?: number;
    deliveryTime?: string;
    address: string;
    phoneNumber: string;
}

interface MenuItem {
    id?: number;
    menuItemId?: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
}

const RestaurantOwnerDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    // Orders State
    const [orders, setOrders] = useState<Order[]>([]);

    // Restaurant State
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [restaurantForm, setRestaurantForm] = useState<Restaurant | null>(null);

    // Menu State
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [itemForm, setItemForm] = useState<MenuItem>({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        isAvailable: true
    });

    useEffect(() => {
        // Wait for auth to load from localStorage
        // If user is explicitly null (not just loading), redirect
        if (user === null && localStorage.getItem('user')) {
            // User is still loading from localStorage, don't redirect yet
            return;
        }

        // Redirect if not restaurant owner
        if (!user || user.role !== 'ROLE_RESTAURANT_OWNER') {
            navigate('/');
            return;
        }

        if (!user.restaurantId) {
            alert('No restaurant assigned to this account');
            navigate('/');
            return;
        }

        loadData();
    }, [user, navigate]);

    const loadData = async () => {
        if (!user?.restaurantId) return;

        try {
            setLoading(true);
            await Promise.all([
                loadOrders(),
                loadRestaurantDetails(),
                loadMenu()
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadOrders = async () => {
        if (!user?.restaurantId) return;
        try {
            const data = await getRestaurantOrders(user.restaurantId);
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    };

    const loadRestaurantDetails = async () => {
        if (!user?.restaurantId) return;
        try {
            const data = await getRestaurantDetails(user.restaurantId);
            setRestaurant(data);
            setRestaurantForm(data);
        } catch (error) {
            console.error('Error loading restaurant:', error);
        }
    };

    const loadMenu = async () => {
        if (!user?.restaurantId) return;
        try {
            const data = await getRestaurantMenu(user.restaurantId);
            setMenuItems(data.items || []);
        } catch (error) {
            console.error('Error loading menu:', error);
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            await loadOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    };

    const handleSaveRestaurant = async () => {
        if (!user?.restaurantId || !restaurantForm) return;
        try {
            await updateRestaurant(user.restaurantId, restaurantForm);
            setIsEditingRestaurant(false);
            await loadRestaurantDetails();
        } catch (error) {
            console.error('Error updating restaurant:', error);
            alert('Failed to update restaurant');
        }
    };

    const handleDeleteRestaurant = async () => {
        if (!user?.restaurantId) return;
        try {
            await deleteRestaurant(user.restaurantId);
            alert('Restaurant deleted successfully');
            navigate('/');
        } catch (error) {
            console.error('Error deleting restaurant:', error);
            alert('Failed to delete restaurant');
        }
    };

    const handleAddMenuItem = async () => {
        if (!user?.restaurantId) return;
        try {
            await addMenuItem(user.restaurantId, itemForm);
            setIsAddingItem(false);
            setItemForm({
                name: '',
                description: '',
                price: 0,
                imageUrl: '',
                isAvailable: true
            });
            await loadMenu();
        } catch (error) {
            console.error('Error adding menu item:', error);
            alert('Failed to add menu item');
        }
    };

    const handleUpdateMenuItem = async () => {
        if (!user?.restaurantId || !editingItem) return;
        const itemId = editingItem.id || editingItem.menuItemId;
        if (!itemId) return;

        try {
            await updateMenuItem(user.restaurantId, itemId, itemForm);
            setEditingItem(null);
            await loadMenu();
        } catch (error) {
            console.error('Error updating menu item:', error);
            alert('Failed to update menu item');
        }
    };

    const handleDeleteMenuItem = async (menuItemId: number) => {
        if (!user?.restaurantId) return;
        if (!confirm('Are you sure you want to delete this menu item?')) return;

        try {
            await deleteMenuItem(user.restaurantId, menuItemId);
            await loadMenu();
        } catch (error) {
            console.error('Error deleting menu item:', error);
            alert('Failed to delete menu item');
        }
    };

    const startEditingItem = (item: MenuItem) => {
        setEditingItem(item);
        setItemForm({
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
            isAvailable: item.isAvailable
        });
    };

    // Statistics calculations
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'PLACED').length;
    const preparingOrders = orders.filter(o => o.status === 'PREPARING').length;
    const readyOrders = orders.filter(o => o.status === 'READY_FOR_PICKUP').length;
    const completedOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'DELIVERED').length;

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const uniqueCustomers = new Set(orders.map(o => o.userId)).size;

    // Today's orders
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.date).toDateString() === today);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text- slate-900">{restaurant?.name}</h2>
                    <p className="text-sm text-slate-600 mt-1">Restaurant Owner</p>
                </div>

                <nav className="flex-1 p-4">
                    <Link
                        to="/restaurant-owner/dashboard"
                        className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${location.pathname === '/restaurant-owner/dashboard'
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <LayoutDashboard className="h-5 w-5 mr-3" />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link
                        to="/restaurant-owner/orders"
                        className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${location.pathname === '/restaurant-owner/orders'
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <Package className="h-5 w-5 mr-3" />
                        <span className="font-medium">Orders</span>
                        {pendingOrders > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {pendingOrders}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/restaurant-owner/restaurant"
                        className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${location.pathname === '/restaurant-owner/restaurant'
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <Store className="h-5 w-5 mr-3" />
                        <span className="font-medium">Restaurant</span>
                    </Link>

                    <Link
                        to="/restaurant-owner/menu"
                        className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${location.pathname === '/restaurant-owner/menu'
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <UtensilsCrossed className="h-5 w-5 mr-3" />
                        <span className="font-medium">Menu</span>
                        <span className="ml-auto text-xs text-slate-500">{menuItems.length}</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    <Routes>
                        <Route index element={<Navigate to="/restaurant-owner/dashboard" replace />} />
                        <Route path="dashboard" element={
                            <DashboardView
                                totalOrders={totalOrders}
                                totalRevenue={totalRevenue}
                                uniqueCustomers={uniqueCustomers}
                                pendingOrders={pendingOrders}
                                todayOrders={todayOrders}
                                todayRevenue={todayRevenue}
                                preparingOrders={preparingOrders}
                                readyOrders={readyOrders}
                                completedOrders={completedOrders}
                            />
                        } />
                        <Route path="orders" element={
                            <OrdersView
                                orders={orders}
                                onUpdateStatus={handleUpdateOrderStatus}
                            />
                        } />
                        <Route path="restaurant" element={
                            restaurant ? (
                                <RestaurantView
                                    restaurant={restaurant}
                                    restaurantForm={restaurantForm}
                                    isEditing={isEditingRestaurant}
                                    showDeleteModal={showDeleteModal}
                                    onEdit={() => setIsEditingRestaurant(true)}
                                    onCancel={() => {
                                        setIsEditingRestaurant(false);
                                        setRestaurantForm(restaurant);
                                    }}
                                    onSave={handleSaveRestaurant}
                                    onDelete={() => setShowDeleteModal(true)}
                                    onCancelDelete={() => setShowDeleteModal(false)}
                                    onConfirmDelete={handleDeleteRestaurant}
                                    onFormChange={setRestaurantForm}
                                />
                            ) : <div>Loading restaurant...</div>
                        } />
                        <Route path="menu" element={
                            <MenuView
                                menuItems={menuItems}
                                isAddingItem={isAddingItem}
                                editingItem={editingItem}
                                itemForm={itemForm}
                                onAddItem={() => setIsAddingItem(true)}
                                onCancelAdd={() => {
                                    setIsAddingItem(false);
                                    setEditingItem(null);
                                    setItemForm({
                                        name: '',
                                        description: '',
                                        price: 0,
                                        imageUrl: '',
                                        isAvailable: true
                                    });
                                }}
                                onSaveItem={isAddingItem ? handleAddMenuItem : handleUpdateMenuItem}
                                onEditItem={startEditingItem}
                                onDeleteItem={handleDeleteMenuItem}
                                onFormChange={setItemForm}
                            />
                        } />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

// Dashboard View Component
const DashboardView: React.FC<{
    totalOrders: number;
    totalRevenue: number;
    uniqueCustomers: number;
    pendingOrders: number;
    todayOrders: any[];
    todayRevenue: number;
    preparingOrders: number;
    readyOrders: number;
    completedOrders: number;
}> = ({ totalOrders, totalRevenue, uniqueCustomers, pendingOrders, todayOrders, todayRevenue, preparingOrders, readyOrders, completedOrders }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Orders"
                    value={totalOrders}
                    icon={<Package className="h-6 w-6" />}
                    color="blue"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toFixed(2)}`}
                    icon={<DollarSign className="h-6 w-6" />}
                    color="green"
                />
                <StatCard
                    title="Customers"
                    value={uniqueCustomers}
                    icon={<Users className="h-6 w-6" />}
                    color="purple"
                />
                <StatCard
                    title="New Orders"
                    value={pendingOrders}
                    icon={<Clock className="h-6 w-6" />}
                    color="orange"
                />
            </div>

            {/* Today's Statistics */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Today's Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-slate-600">Orders Today</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{todayOrders.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600">Revenue Today</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">${todayRevenue.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600">Average Order Value</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            ${todayOrders.length > 0 ? (todayRevenue / todayOrders.length).toFixed(2) : '0.00'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
                        <p className="text-sm text-slate-600 mt-1">New</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-3xl font-bold text-orange-600">{preparingOrders}</p>
                        <p className="text-sm text-slate-600 mt-1">Preparing</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">{readyOrders}</p>
                        <p className="text-sm text-slate-600 mt-1">Ready</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">{completedOrders}</p>
                        <p className="text-sm text-slate-600 mt-1">Completed</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'orange';
}> = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Orders View Component
const OrdersView: React.FC<{
    orders: Order[];
    onUpdateStatus: (orderId: string, status: string) => void;
}> = ({ orders, onUpdateStatus }) => {
    const newOrders = orders.filter(o => o.status === 'PLACED');
    const preparingOrders = orders.filter(o => o.status === 'PREPARING');
    const readyOrders = orders.filter(o => o.status === 'READY_FOR_PICKUP');

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Orders</h1>

            <div className="space-y-8">
                {/* New Orders */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Package className="h-6 w-6 mr-2 text-yellow-600" />
                        New Orders ({newOrders.length})
                    </h2>
                    <div className="grid gap-4">
                        {newOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onUpdateStatus={onUpdateStatus}
                                availableStatuses={['PREPARING']}
                            />
                        ))}
                        {newOrders.length === 0 && (
                            <p className="text-slate-500">No new orders</p>
                        )}
                    </div>
                </div>

                {/* Preparing Orders */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <ChefHat className="h-6 w-6 mr-2 text-orange-600" />
                        Preparing ({preparingOrders.length})
                    </h2>
                    <div className="grid gap-4">
                        {preparingOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onUpdateStatus={onUpdateStatus}
                                availableStatuses={['READY_FOR_PICKUP']}
                            />
                        ))}
                        {preparingOrders.length === 0 && (
                            <p className="text-slate-500">No orders being prepared</p>
                        )}
                    </div>
                </div>

                {/* Ready for Pickup */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                        Ready for Pickup ({readyOrders.length})
                    </h2>
                    <div className="grid gap-4">
                        {readyOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onUpdateStatus={onUpdateStatus}
                                availableStatuses={[]}
                            />
                        ))}
                        {readyOrders.length === 0 && (
                            <p className="text-slate-500">No orders ready for pickup</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Restaurant View Component  
const RestaurantView: React.FC<{
    restaurant: Restaurant;
    restaurantForm: Restaurant | null;
    isEditing: boolean;
    showDeleteModal: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    onDelete: () => void;
    onCancelDelete: () => void;
    onConfirmDelete: () => void;
    onFormChange: (form: Restaurant | null) => void;
}> = ({ restaurant, restaurantForm, isEditing, showDeleteModal, onEdit, onCancel, onSave, onDelete, onCancelDelete, onConfirmDelete, onFormChange }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Restaurant Management</h1>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={onEdit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                        >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Restaurant
                        </button>
                        <button
                            onClick={onDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Restaurant
                        </button>
                    </div>
                </div>

                {restaurant.imageUrl && (
                    <img
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Cuisine Type</p>
                        <p className="mt-1 text-lg">{restaurant.cuisineType}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Delivery Time</p>
                        <p className="mt-1 text-lg">{restaurant.deliveryTime || 'Not set'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Address</p>
                        <p className="mt-1 text-lg">{restaurant.address}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Phone Number</p>
                        <p className="mt-1 text-lg">{restaurant.phoneNumber}</p>
                    </div>
                    {restaurant.rating && (
                        <div>
                            <p className="text-sm font-medium text-slate-500">Rating</p>
                            <p className="mt-1 text-lg">{restaurant.rating.toFixed(1)} ⭐</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <CardHeader className="border-b">
                            <div className="flex justify-between items-center">
                                <CardTitle>Edit Restaurant</CardTitle>
                                <button
                                    onClick={onCancel}
                                    className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-6">
                            <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Restaurant Name</label>
                                    <Input
                                        value={restaurantForm?.name || ''}
                                        onChange={(e) => onFormChange(restaurantForm ? { ...restaurantForm, name: e.target.value } : null)}
                                        required
                                        placeholder="Enter restaurant name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Address</label>
                                    <Input
                                        value={restaurantForm?.address || ''}
                                        onChange={(e) => onFormChange(restaurantForm ? { ...restaurantForm, address: e.target.value } : null)}
                                        required
                                        placeholder="Enter address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                                    <Input
                                        value={restaurantForm?.phoneNumber || ''}
                                        onChange={(e) => onFormChange(restaurantForm ? { ...restaurantForm, phoneNumber: e.target.value } : null)}
                                        required
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Cuisine Type</label>
                                    <Input
                                        value={restaurantForm?.cuisineType || ''}
                                        onChange={(e) => onFormChange(restaurantForm ? { ...restaurantForm, cuisineType: e.target.value } : null)}
                                        required
                                        placeholder="e.g., Italian, Chinese, Mexican"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Restaurant Image</label>
                                    <div className="space-y-3">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const maxSize = 3 * 1024 * 1024;
                                                    if (file.size > maxSize) {
                                                        alert('Image size must be less than 3MB');
                                                        e.target.value = '';
                                                        return;
                                                    }
                                                    if (file.size === 0) {
                                                        alert('The selected file is empty');
                                                        e.target.value = '';
                                                        return;
                                                    }
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        onFormChange(restaurantForm ? { ...restaurantForm, imageUrl: reader.result as string } : null);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="cursor-pointer"
                                        />
                                        <p className="text-xs text-slate-500">Maximum file size: 3MB</p>
                                        {restaurantForm?.imageUrl && (
                                            <div className="mt-2">
                                                <img
                                                    src={restaurantForm.imageUrl}
                                                    alt="Preview"
                                                    className="w-32 h-32 object-cover rounded-lg border"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Rating (Optional)</label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            value={restaurantForm?.rating || ''}
                                            onChange={(e) => onFormChange(restaurantForm ? {
                                                ...restaurantForm,
                                                rating: e.target.value ? parseFloat(e.target.value) : undefined
                                            } : null)}
                                            placeholder="e.g., 4.5"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Delivery Time</label>
                                        <Input
                                            value={restaurantForm?.deliveryTime || ''}
                                            onChange={(e) => onFormChange(restaurantForm ? {
                                                ...restaurantForm,
                                                deliveryTime: e.target.value
                                            } : null)}
                                            placeholder="e.g., 30-40 min"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                        Update Restaurant
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onCancel}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-red-100 p-3 rounded-full mr-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Delete Restaurant</h2>
                        </div>

                        <div className="mb-6">
                            <p className="text-slate-700 mb-3">
                                Are you sure you want to delete <strong>{restaurant.name}</strong>?
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800 font-medium mb-2">⚠️ Warning: This action cannot be undone!</p>
                                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                                    <li>All menu items will be removed</li>
                                    <li>Historical order data may be affected</li>
                                    <li>You will lose access to this dashboard</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onCancelDelete}
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                            >
                                Delete Restaurant
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Menu View Component
const MenuView: React.FC<{
    menuItems: MenuItem[];
    isAddingItem: boolean;
    editingItem: MenuItem | null;
    itemForm: MenuItem;
    onAddItem: () => void;
    onCancelAdd: () => void;
    onSaveItem: () => void;
    onEditItem: (item: MenuItem) => void;
    onDeleteItem: (id: number) => void;
    onFormChange: (form: MenuItem) => void;
}> = ({ menuItems, isAddingItem, editingItem, itemForm, onAddItem, onCancelAdd, onSaveItem, onEditItem, onDeleteItem, onFormChange }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Menu Management</h1>
                <button
                    onClick={onAddItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                </button>
            </div>

            {(isAddingItem || editingItem) && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4">
                        {isAddingItem ? 'Add Menu Item' : 'Edit Menu Item'}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                            <input
                                type="text"
                                value={itemForm.name}
                                onChange={(e) => onFormChange({ ...itemForm, name: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea
                                value={itemForm.description}
                                onChange={(e) => onFormChange({ ...itemForm, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                value={itemForm.price}
                                onChange={(e) => onFormChange({ ...itemForm, price: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
                            <input
                                type="text"
                                value={itemForm.imageUrl}
                                onChange={(e) => onFormChange({ ...itemForm, imageUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="available"
                                checked={itemForm.isAvailable}
                                onChange={(e) => onFormChange({ ...itemForm, isAvailable: e.target.checked })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                            />
                            <label htmlFor="available" className="ml-2 block text-sm text-slate-900">
                                Available
                            </label>
                        </div>
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                onClick={onCancelAdd}
                                className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSaveItem}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {isAddingItem ? 'Add Item' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => {
                    const itemId = item.id || item.menuItemId;
                    return (
                        <div key={itemId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {item.imageUrl && (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${item.isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {item.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm mb-3">{item.description}</p>
                                <p className="text-lg font-bold text-blue-600 mb-4">${item.price.toFixed(2)}</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEditItem(item)}
                                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center justify-center"
                                    >
                                        <Edit2 className="h-4 w-4 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => itemId && onDeleteItem(itemId)}
                                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center justify-center"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {menuItems.length === 0 && (
                <div className="text-center py-12">
                    <UtensilsCrossed className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-500">No menu items yet. Add your first item!</p>
                </div>
            )}
        </div>
    );
};

// Order Card Component
const OrderCard: React.FC<{
    order: Order;
    onUpdateStatus: (orderId: string, status: string) => void;
    availableStatuses: string[];
}> = ({ order, onUpdateStatus, availableStatuses }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PLACED': return 'bg-yellow-100 text-yellow-800';
            case 'PREPARING': return 'bg-orange-100 text-orange-800';
            case 'READY_FOR_PICKUP': return 'bg-green-100 text-green-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PREPARING': return 'Start Preparing';
            case 'READY_FOR_PICKUP': return 'Mark Ready for Pickup';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-slate-600">
                        {new Date(order.date).toLocaleString()}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                </span>
            </div>

            <div className="mb-4">
                <p className="text-sm font-medium text-slate-700">Items: {order.items.length}</p>
                <p className="text-lg font-bold text-slate-900">${order.totalAmount.toFixed(2)}</p>
            </div>

            {availableStatuses.length > 0 && (
                <div className="flex space-x-2">
                    {availableStatuses.map(status => (
                        <button
                            key={status}
                            onClick={() => onUpdateStatus(order.id, status)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {getStatusLabel(status)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantOwnerDashboard;
