import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { orderService } from '../api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

interface Restaurant {
    id?: number;
    restaurantId: number;
    name: string;
    address: string;
    phoneNumber: string;
    cuisineType: string;
    imageUrl?: string;
    rating?: number;
    deliveryTime?: string;
}

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    available: boolean;
}

const RestaurantManagement: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        cuisineType: '',
        imageUrl: '',
        rating: '',
        deliveryTime: ''
    });

    // Menu management state
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [showMenuItemForm, setShowMenuItemForm] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
    const [menuItemFormData, setMenuItemFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        available: true
    });

    useEffect(() => {
        fetchRestaurants();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = restaurants.filter(r =>
                r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.cuisineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRestaurants(filtered);
        } else {
            setFilteredRestaurants(restaurants);
        }
    }, [searchTerm, restaurants]);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await orderService.get('/api/restaurants', {
                baseURL: 'http://localhost:8082'
            });
            setRestaurants(response.data || []);
        } catch (err) {
            console.error('Failed to fetch restaurants:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingRestaurant(null);
        setFormData({ name: '', address: '', phoneNumber: '', cuisineType: '', imageUrl: '', rating: '', deliveryTime: '' });
        setShowForm(true);
    };

    const handleEdit = (restaurant: Restaurant) => {
        setEditingRestaurant(restaurant);
        setFormData({
            name: restaurant.name,
            address: restaurant.address,
            phoneNumber: restaurant.phoneNumber,
            cuisineType: restaurant.cuisineType,
            imageUrl: restaurant.imageUrl || '',
            rating: restaurant.rating?.toString() || '',
            deliveryTime: restaurant.deliveryTime || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this restaurant?')) return;

        try {
            await orderService.delete(`/api/restaurants/${id}`, {
                baseURL: 'http://localhost:8082'
            });
            await fetchRestaurants();
        } catch (err) {
            console.error('Failed to delete restaurant:', err);
            alert('Failed to delete restaurant');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const restaurantData = {
            name: formData.name,
            address: formData.address,
            phoneNumber: formData.phoneNumber,
            cuisineType: formData.cuisineType,
            imageUrl: formData.imageUrl,
            rating: formData.rating ? parseFloat(formData.rating) : undefined,
            deliveryTime: formData.deliveryTime
        };

        try {
            if (editingRestaurant) {
                const id = editingRestaurant.id || editingRestaurant.restaurantId;
                await orderService.put(`/api/restaurants/${id}`, restaurantData, {
                    baseURL: 'http://localhost:8082'
                });
            } else {
                await orderService.post('/api/restaurants', restaurantData, {
                    baseURL: 'http://localhost:8082'
                });
            }

            setShowForm(false);
            await fetchRestaurants();
        } catch (err) {
            console.error('Failed to save restaurant:', err);
            alert('Failed to save restaurant');
        }
    };

    // Menu management functions
    const handleOpenMenu = async (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setShowMenuModal(true);
        const id = restaurant.id || restaurant.restaurantId;
        await fetchMenuItems(id);
    };

    const fetchMenuItems = async (restaurantId: number) => {
        try {
            const response = await orderService.get(`/api/restaurants/${restaurantId}/menu`, {
                baseURL: 'http://localhost:8082'
            });
            setMenuItems(response.data?.items || []);
        } catch (err) {
            console.error('Failed to fetch menu items:', err);
            setMenuItems([]);
        }
    };

    const handleAddMenuItem = () => {
        setEditingMenuItem(null);
        setMenuItemFormData({ name: '', description: '', price: '', imageUrl: '', available: true });
        setShowMenuItemForm(true);
    };

    const handleEditMenuItem = (item: MenuItem) => {
        setEditingMenuItem(item);
        setMenuItemFormData({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            imageUrl: item.imageUrl || '',
            available: item.available
        });
        setShowMenuItemForm(true);
    };

    const handleDeleteMenuItem = async (itemId: number) => {
        if (!selectedRestaurant || !confirm('Are you sure you want to delete this menu item?')) return;

        try {
            const id = selectedRestaurant.id || selectedRestaurant.restaurantId;
            await orderService.delete(`/api/restaurants/${id}/menu/items/${itemId}`, {
                baseURL: 'http://localhost:8082'
            });
            await fetchMenuItems(id);
        } catch (err) {
            console.error('Failed to delete menu item:', err);
            alert('Failed to delete menu item');
        }
    };

    const handleSubmitMenuItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRestaurant) return;

        const itemData = {
            name: menuItemFormData.name,
            description: menuItemFormData.description,
            price: parseFloat(menuItemFormData.price),
            imageUrl: menuItemFormData.imageUrl,
            available: menuItemFormData.available
        };

        try {
            const id = selectedRestaurant.id || selectedRestaurant.restaurantId;
            if (editingMenuItem) {
                await orderService.put(
                    `/api/restaurants/${id}/menu/items/${editingMenuItem.id}`,
                    itemData,
                    { baseURL: 'http://localhost:8082' }
                );
            } else {
                await orderService.post(
                    `/api/restaurants/${id}/menu/items`,
                    itemData,
                    { baseURL: 'http://localhost:8082' }
                );
            }

            setShowMenuItemForm(false);
            await fetchMenuItems(id);
        } catch (err) {
            console.error('Failed to save menu item:', err);
            alert('Failed to save menu item');
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-200 rounded-lg" />
                ))}
            </div>
        );
    }

    if (showForm) {
        return (
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>{editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Restaurant Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Enter restaurant name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Address</label>
                            <Input
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                                placeholder="Enter address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Phone Number</label>
                            <Input
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                required
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Cuisine Type</label>
                            <Input
                                value={formData.cuisineType}
                                onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
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
                                                setFormData({ ...formData, imageUrl: reader.result as string });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-slate-500">Maximum file size: 3MB</p>
                                {formData.imageUrl && (
                                    <div className="mt-2">
                                        <img
                                            src={formData.imageUrl}
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
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                    placeholder="e.g., 4.5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Delivery Time</label>
                                <Input
                                    value={formData.deliveryTime}
                                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                                    placeholder="e.g., 30-40 min"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                {editingRestaurant ? 'Update' : 'Add'} Restaurant
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search restaurants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Restaurant
                </Button>
            </div>

            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle>Restaurants ({filteredRestaurants.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredRestaurants.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            {searchTerm ? 'No restaurants found matching your search.' : 'No restaurants yet. Add your first restaurant!'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Cuisine Type</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Address</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Phone</th>
                                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRestaurants.map((restaurant) => (
                                        <tr key={restaurant.id || restaurant.restaurantId} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-slate-900">{restaurant.name}</div>
                                                {restaurant.rating && (
                                                    <div className="text-sm text-slate-500">Rating: {restaurant.rating.toFixed(1)}</div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant="secondary">{restaurant.cuisineType}</Badge>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">{restaurant.address}</td>
                                            <td className="py-3 px-4 text-slate-600">{restaurant.phoneNumber}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleOpenMenu(restaurant)}
                                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                    >
                                                        Menu
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(restaurant)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(restaurant.id || restaurant.restaurantId)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {showMenuModal && selectedRestaurant && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Menu - {selectedRestaurant.name}</h2>
                            <Button variant="ghost" onClick={() => { setShowMenuModal(false); setShowMenuItemForm(false); }}>
                                ✕
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {showMenuItemForm ? (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">
                                        {editingMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}
                                    </h3>
                                    <form onSubmit={handleSubmitMenuItem} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Item Name</label>
                                            <Input
                                                value={menuItemFormData.name}
                                                onChange={(e) => setMenuItemFormData({ ...menuItemFormData, name: e.target.value })}
                                                required
                                                placeholder="Enter item name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Description</label>
                                            <Input
                                                value={menuItemFormData.description}
                                                onChange={(e) => setMenuItemFormData({ ...menuItemFormData, description: e.target.value })}
                                                required
                                                placeholder="Enter description"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Price ($)</label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={menuItemFormData.price}
                                                onChange={(e) => setMenuItemFormData({ ...menuItemFormData, price: e.target.value })}
                                                required
                                                placeholder="Enter price"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Image URL (Optional)</label>
                                            <Input
                                                value={menuItemFormData.imageUrl}
                                                onChange={(e) => setMenuItemFormData({ ...menuItemFormData, imageUrl: e.target.value })}
                                                placeholder="Enter image URL"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="available"
                                                checked={menuItemFormData.available}
                                                onChange={(e) => setMenuItemFormData({ ...menuItemFormData, available: e.target.checked })}
                                                className="h-4 w-4"
                                            />
                                            <label htmlFor="available" className="text-sm font-medium">Available</label>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                                {editingMenuItem ? 'Update' : 'Add'} Item
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowMenuItemForm(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold">Menu Items ({menuItems.length})</h3>
                                        <Button onClick={handleAddMenuItem} className="bg-emerald-600 hover:bg-emerald-700">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Item
                                        </Button>
                                    </div>

                                    {menuItems.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500">
                                            No menu items yet. Add your first item!
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {menuItems.map((item) => (
                                                <div key={item.id} className="border rounded-lg p-4 flex gap-4">
                                                    {item.imageUrl && (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            className="w-24 h-24 object-cover rounded-lg"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-semibold text-lg">{item.name}</h4>
                                                                <p className="text-slate-600 text-sm mt-1">{item.description}</p>
                                                                <p className="text-emerald-600 font-bold mt-2">${item.price.toFixed(2)}</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Badge variant={item.available ? 'default' : 'secondary'}>
                                                                    {item.available ? 'Available' : 'Unavailable'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleEditMenuItem(item)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleDeleteMenuItem(item.id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantManagement;
