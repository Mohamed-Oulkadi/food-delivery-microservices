import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  LayoutDashboard, 
  Users, 
  Store, 
  Bike,
  Menu,
  X,
  ShoppingCart
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Restaurant, MenuItem, UserDto, Order } from '../lib/mockData';
import { 
  getRestaurants, 
  getMenuItems, 
  uploadRestaurantImage, 
  uploadMenuItemImage, 
  getUsers, 
  updateUser, 
  deleteUser,
  getOrders
} from '../services/api';
import { toast } from 'sonner';

export const AdminPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [isRestaurantDialogOpen, setIsRestaurantDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');

  // Restaurant form state
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    cuisineType: '',
    address: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMenuItemFile, setSelectedMenuItemFile] = useState<File | null>(null);

  // Menu item form state
  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    description: '',
    price: ''
  });

  // User form state
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const response = await getRestaurants();
        setRestaurants(response.data);
      } catch (error) {
        console.error('Failed to fetch restaurants', error);
        toast.error('Failed to load restaurants');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
        toast.error('Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
        toast.error('Failed to load orders');
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (selectedRestaurantId) {
        try {
          const response = await getMenuItems(selectedRestaurantId);
          setMenuItems(response.data);
        } catch (error) {
          console.error('Failed to fetch menu items', error);
          toast.error('Failed to load menu items');
        }
      }
    };
    fetchMenuItems();
  }, [selectedRestaurantId]);

  // Calculate statistics
  const clients = users.filter(u => u.role === 'ROLE_CLIENT' || u.role === 'ROLE_USER');
  const livreurs = users.filter(u => u.role === 'ROLE_LIVREUR' || u.role === 'ROLE_DELIVERY');
  const admins = users.filter(u => u.role === 'ROLE_ADMIN');
  const orderStatusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);


  const handleAddRestaurant = () => {
    setEditingRestaurant(null);
    setRestaurantForm({ name: '', cuisineType: '', address: '' });
    setSelectedFile(null);
    setIsRestaurantDialogOpen(true);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setRestaurantForm({
      name: restaurant.name,
      cuisineType: restaurant.cuisineType,
      address: restaurant.address
    });
    setSelectedFile(null);
    setIsRestaurantDialogOpen(true);
  };

  const handleSaveRestaurant = async () => {
    if (!restaurantForm.name || !restaurantForm.cuisineType || !restaurantForm.address) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingRestaurant) {
        const updatedRestaurant = { ...editingRestaurant, ...restaurantForm };
        if (selectedFile) {
          const imageUrl = await uploadRestaurantImage(editingRestaurant.restaurantId, selectedFile);
          updatedRestaurant.imageUrl = imageUrl.data;
        }
        setRestaurants(prev =>
          prev.map(r => r.restaurantId === editingRestaurant.restaurantId
            ? updatedRestaurant
            : r
          )
        );
        toast.success('Restaurant updated successfully');
      } else {
        const newRestaurantWithId: Restaurant = {
          restaurantId: `${Date.now()}`,
          ...restaurantForm,
          imageUrl: '',
          rating: 4.5,
          deliveryTime: '30-40 min'
        };

        if (selectedFile) {
          try {
            const imageUrl = await uploadRestaurantImage(newRestaurantWithId.restaurantId, selectedFile);
            newRestaurantWithId.imageUrl = imageUrl.data;
          } catch (error) {
            toast.error('Failed to upload image. Restaurant created without an image.');
          }
        }

        setRestaurants(prev => [...prev, newRestaurantWithId]);
        toast.success('Restaurant added successfully');
      }

      setIsRestaurantDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save restaurant');
    }
  };

  const handleDeleteRestaurant = (id: string) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      setRestaurants(prev => prev.filter(r => r.restaurantId !== id));
      setMenuItems(prev => prev.filter(m => m.restaurantId !== id));
      toast.success('Restaurant deleted successfully');
    }
  };

  const handleManageMenu = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setEditingMenuItem(null);
    setMenuItemForm({ name: '', description: '', price: '' });
    setSelectedMenuItemFile(null);
    setIsMenuDialogOpen(true);
  };

  const handleAddMenuItem = async () => {
    if (!menuItemForm.name || !menuItemForm.description || !menuItemForm.price) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingMenuItem) {
        const updatedMenuItem = { 
          ...editingMenuItem, 
          ...menuItemForm, 
          price: parseFloat(menuItemForm.price) 
        };
        if (selectedMenuItemFile) {
          const imageUrl = await uploadMenuItemImage(editingMenuItem.id, selectedMenuItemFile);
          updatedMenuItem.imageUrl = imageUrl.data;
        }
        setMenuItems(prev =>
          prev.map(m => m.id === editingMenuItem.id ? updatedMenuItem : m)
        );
        toast.success('Menu item updated successfully');
      } else {
        const newMenuItemWithId: MenuItem = {
          id: `m${Date.now()}`,
          restaurantId: selectedRestaurantId,
          name: menuItemForm.name,
          description: menuItemForm.description,
          price: parseFloat(menuItemForm.price),
          imageUrl: '',
        };

        if (selectedMenuItemFile) {
          try {
            const imageUrl = await uploadMenuItemImage(newMenuItemWithId.id, selectedMenuItemFile);
            newMenuItemWithId.imageUrl = imageUrl.data;
          } catch (error) {
            toast.error('Failed to upload image. Menu item created without an image.');
          }
        }

        setMenuItems(prev => [...prev, newMenuItemWithId]);
        toast.success('Menu item added successfully');
      }

      setMenuItemForm({ name: '', description: '', price: '' });
      setEditingMenuItem(null);
      setSelectedMenuItemFile(null);
    } catch (error) {
      toast.error('Failed to save menu item');
    }
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setMenuItemForm({
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price.toString()
    });
    setSelectedMenuItemFile(null);
  };

  const handleDeleteMenuItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems(prev => prev.filter(m => m.id !== id));
      toast.success('Menu item deleted successfully');
    }
  };

  const handleEditUser = (user: UserDto) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      email: user.email,
      role: user.role
    });
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      const updatedUser = await updateUser(editingUser.userId, { ...editingUser, ...userForm });
      setUsers(prev => prev.map(u => u.userId === editingUser.userId ? updatedUser.data : u));
      toast.success('User updated successfully');
      setIsUserDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(prev => prev.filter(u => u.userId !== id));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const currentRestaurantMenuItems = menuItems.filter(m => m.restaurantId === selectedRestaurantId);
  const currentRestaurant = restaurants.find(r => r.restaurantId === selectedRestaurantId);

  // Sidebar navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
    { id: 'clients', label: 'Clients', icon: Users, to: '/admin/clients' },
    { id: 'restaurants', label: 'Restaurants', icon: Store, to: '/admin/restaurants' },
    { id: 'livreurs', label: 'Livreurs', icon: Bike, to: '/admin/livreurs' },
  ];

  // Dashboard View
  const DashboardView = () => (
    <div>
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
      </div>
      
      <div className="flex flex-row flex-nowrap gap-4 mb-8 overflow-x-auto">
        <Card className="bg-blue-50 text-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-blue-700">Active users on platform</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 text-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
            <Store className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurants.length}</div>
            <p className="text-xs text-green-700">Partner restaurants</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 text-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Livreurs</CardTitle>
            <Bike className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{livreurs.length}</div>
            <p className="text-xs text-orange-700">Delivery personnel available</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 text-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-purple-700">Total orders placed</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-orange-600">Pending</span>
                <span className="text-lg font-bold text-orange-900">{orderStatusCounts['PENDING'] || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-600">In Transit</span>
                <span className="text-lg font-bold text-blue-900">{orderStatusCounts['IN_TRANSIT'] || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-600">Delivered</span>
                <span className="text-lg font-bold text-green-900">{orderStatusCounts['DELIVERED'] || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">Total Menu Items</span>
                <span className="text-lg font-bold text-slate-900">{menuItems.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">System Admins</span>
                <span className="text-lg font-bold text-slate-900">{admins.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">Avg. Items/Restaurant</span>
                <span className="text-lg font-bold text-slate-900">
                  {restaurants.length > 0 ? (menuItems.length / restaurants.length).toFixed(1) : '0.0'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Clients View
  const ClientsView = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Client Management</h2>
          <p className="text-sm text-slate-600 mt-1">Manage all client accounts</p>
        </div>
        <div className="text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <span className="font-semibold text-blue-700">{clients.length}</span> total clients
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No clients found
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map(user => (
                    <TableRow key={user.userId} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium">{user.userId}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs rounded-full font-medium">
                          {user.role.replace('ROLE_', '')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                            className="hover:bg-green-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.userId)}
                            className="hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Restaurants View
  const RestaurantsView = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Restaurant Management</h2>
          <p className="text-sm text-slate-600 mt-1">Manage partner restaurants and menus</p>
        </div>
        <Button onClick={handleAddRestaurant} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Restaurant
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Cuisine Type</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No restaurants found. Click "Add Restaurant" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  restaurants.map(restaurant => (
                    <TableRow key={restaurant.restaurantId} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium">{restaurant.restaurantId}</TableCell>
                      <TableCell className="font-semibold">{restaurant.name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          {restaurant.cuisineType}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={restaurant.address}>
                        {restaurant.address}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleManageMenu(restaurant.restaurantId)}
                            className="hover:bg-green-50"
                          >
                            Menu
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditRestaurant(restaurant)}
                            className="hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteRestaurant(restaurant.restaurantId)}
                            className="hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Livreurs View
  const LivreursView = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Livreur Management</h2>
          <p className="text-sm text-slate-600 mt-1">Manage delivery personnel</p>
        </div>
        <div className="text-sm text-slate-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
          <span className="font-semibold text-orange-700">{livreurs.length}</span> total livreurs
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {livreurs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No delivery personnel found
                    </TableCell>
                  </TableRow>
                ) : (
                  livreurs.map(user => (
                    <TableRow key={user.userId} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium">{user.userId}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                          {user.role.replace('ROLE_', '')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                            className="hover:bg-green-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.userId)}
                            className="hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-slate-200 transition-all duration-300 shadow-sm flex flex-col ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 h-16 flex-shrink-0">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EF</span>
              </div>
              <span className="font-bold text-lg text-slate-900">ExpressFood</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto hover:bg-slate-100"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navigationItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.to}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.to
                    ? 'bg-green-50 text-green-700 font-semibold shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-end px-8 flex-shrink-0 z-40">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-slate-700 font-medium text-sm">A</span>
            </div>
            <span className="text-slate-900 font-medium">admin</span>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="dashboard" element={<DashboardView />} />
                <Route path="clients" element={<ClientsView />} />
                <Route path="restaurants" element={<RestaurantsView />} />
                <Route path="livreurs" element={<LivreursView />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>

      {/* Dialogs remain the same */}
      {/* Restaurant Dialog */}
      <Dialog open={isRestaurantDialogOpen} onOpenChange={setIsRestaurantDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
            </DialogTitle>
            <DialogDescription>
              {editingRestaurant ? 'Update restaurant information' : 'Enter restaurant details'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Mario's Italian Kitchen"
                value={restaurantForm.name}
                onChange={(e) => setRestaurantForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuisineType">Cuisine Type *</Label>
              <Input
                id="cuisineType"
                placeholder="e.g., Italian, Mexican, Japanese"
                value={restaurantForm.cuisineType}
                onChange={(e) => setRestaurantForm(prev => ({ ...prev, cuisineType: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="Full address"
                value={restaurantForm.address}
                onChange={(e) => setRestaurantForm(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Restaurant Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
              />
              {selectedFile && (
                <p className="text-xs text-slate-500">Selected: {selectedFile.name}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestaurantDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRestaurant} className="bg-green-600 hover:bg-green-700">
              {editingRestaurant ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={userForm.username}
                onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={userForm.role}
                onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., ROLE_CLIENT, ROLE_LIVREUR"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser} className="bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Menu Dialog */}
      <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Menu - {currentRestaurant?.name}</DialogTitle>
            <DialogDescription>Add, edit, or remove menu items for this restaurant</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Card className="border-2 border-dashed">
              <CardHeader>
                <CardTitle className="text-base">
                  {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="menuName">Item Name *</Label>
                    <Input
                      id="menuName"
                      placeholder="e.g., Margherita Pizza"
                      value={menuItemForm.name}
                      onChange={(e) => setMenuItemForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menuPrice">Price ($) *</Label>
                    <Input
                      id="menuPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="12.99"
                      value={menuItemForm.price}
                      onChange={(e) => setMenuItemForm(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menuDescription">Description *</Label>
                  <Input
                    id="menuDescription"
                    placeholder="Describe the menu item"
                    value={menuItemForm.description}
                    onChange={(e) => setMenuItemForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menuItemImage">Item Image</Label>
                  <Input
                    id="menuItemImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedMenuItemFile(e.target.files ? e.target.files[0] : null)}
                  />
                  {selectedMenuItemFile && (
                    <p className="text-xs text-slate-500">Selected: {selectedMenuItemFile.name}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddMenuItem} 
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {editingMenuItem ? 'Update Item' : 'Add Item'}
                  </Button>
                  {editingMenuItem && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingMenuItem(null);
                        setMenuItemForm({ name: '', description: '', price: '' });
                        setSelectedMenuItemFile(null);
                      }}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div>
              <h4 className="font-semibold text-lg mb-4">Current Menu Items ({currentRestaurantMenuItems.length})</h4>
              {currentRestaurantMenuItems.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed">
                  No menu items yet. Add your first item above.
                </div>
              ) : (
                <div className="space-y-2">
                  {currentRestaurantMenuItems.map(item => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600">{item.description}</p>
                        <p className="text-sm text-green-600 font-semibold mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMenuItem(item)}
                          className="hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsMenuDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
