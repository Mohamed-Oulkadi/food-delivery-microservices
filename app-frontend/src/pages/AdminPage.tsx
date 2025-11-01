import { useState } from 'react';
import { Plus, Pencil, Trash2, LayoutDashboard } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockRestaurants, mockMenuItems, mockUsers, Restaurant, MenuItem } from '../lib/mockData';
import { toast } from 'sonner@2.0.3';

export const AdminPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  
  const [isRestaurantDialogOpen, setIsRestaurantDialogOpen] = useState(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');

  // Restaurant form state
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    cuisineType: '',
    address: ''
  });

  // Menu item form state
  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    description: '',
    price: ''
  });

  const handleAddRestaurant = () => {
    setEditingRestaurant(null);
    setRestaurantForm({ name: '', cuisineType: '', address: '' });
    setIsRestaurantDialogOpen(true);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setRestaurantForm({
      name: restaurant.name,
      cuisineType: restaurant.cuisineType,
      address: restaurant.address
    });
    setIsRestaurantDialogOpen(true);
  };

  const handleSaveRestaurant = () => {
    if (!restaurantForm.name || !restaurantForm.cuisineType || !restaurantForm.address) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingRestaurant) {
      setRestaurants(prev =>
        prev.map(r => r.id === editingRestaurant.id
          ? { ...r, ...restaurantForm }
          : r
        )
      );
      toast.success('Restaurant updated successfully');
    } else {
      const newRestaurant: Restaurant = {
        id: `${Date.now()}`,
        ...restaurantForm,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        rating: 4.5,
        deliveryTime: '30-40 min'
      };
      setRestaurants(prev => [...prev, newRestaurant]);
      toast.success('Restaurant added successfully');
    }

    setIsRestaurantDialogOpen(false);
  };

  const handleDeleteRestaurant = (id: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== id));
    setMenuItems(prev => prev.filter(m => m.restaurantId !== id));
    toast.success('Restaurant deleted successfully');
  };

  const handleManageMenu = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setEditingMenuItem(null);
    setMenuItemForm({ name: '', description: '', price: '' });
    setIsMenuDialogOpen(true);
  };

  const handleAddMenuItem = () => {
    if (!menuItemForm.name || !menuItemForm.description || !menuItemForm.price) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingMenuItem) {
      setMenuItems(prev =>
        prev.map(m => m.id === editingMenuItem.id
          ? { ...m, name: menuItemForm.name, description: menuItemForm.description, price: parseFloat(menuItemForm.price) }
          : m
        )
      );
      toast.success('Menu item updated successfully');
    } else {
      const newMenuItem: MenuItem = {
        id: `m${Date.now()}`,
        restaurantId: selectedRestaurantId,
        name: menuItemForm.name,
        description: menuItemForm.description,
        price: parseFloat(menuItemForm.price)
      };
      setMenuItems(prev => [...prev, newMenuItem]);
      toast.success('Menu item added successfully');
    }

    setMenuItemForm({ name: '', description: '', price: '' });
    setEditingMenuItem(null);
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setMenuItemForm({
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price.toString()
    });
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
    toast.success('Menu item deleted successfully');
  };

  const currentRestaurantMenuItems = menuItems.filter(m => m.restaurantId === selectedRestaurantId);
  const currentRestaurant = restaurants.find(r => r.id === selectedRestaurantId);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="h-8 w-8 text-green-600" />
          <h1 className="text-gray-900">Admin Panel</h1>
        </div>

        <Tabs defaultValue="restaurants" className="space-y-6">
          <TabsList>
            <TabsTrigger value="restaurants">Manage Restaurants</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
          </TabsList>

          <TabsContent value="restaurants" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Restaurant Management</CardTitle>
                <Button onClick={handleAddRestaurant} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Restaurant
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Cuisine Type</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {restaurants.map(restaurant => (
                      <TableRow key={restaurant.id}>
                        <TableCell>{restaurant.id}</TableCell>
                        <TableCell>{restaurant.name}</TableCell>
                        <TableCell>{restaurant.cuisineType}</TableCell>
                        <TableCell>{restaurant.address}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleManageMenu(restaurant.id)}
                            >
                              Menu
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditRestaurant(restaurant)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteRestaurant(restaurant.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role.replace('ROLE_', '')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Restaurant Dialog */}
        <Dialog open={isRestaurantDialogOpen} onOpenChange={setIsRestaurantDialogOpen}>
          <DialogContent>
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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={restaurantForm.name}
                  onChange={(e) => setRestaurantForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cuisineType">Cuisine Type</Label>
                <Input
                  id="cuisineType"
                  value={restaurantForm.cuisineType}
                  onChange={(e) => setRestaurantForm(prev => ({ ...prev, cuisineType: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={restaurantForm.address}
                  onChange={(e) => setRestaurantForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRestaurantDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRestaurant} className="bg-green-600 hover:bg-green-700">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Menu Dialog */}
        <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Menu - {currentRestaurant?.name}</DialogTitle>
              <DialogDescription>Add, edit, or remove menu items</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="menuName">Item Name</Label>
                    <Input
                      id="menuName"
                      value={menuItemForm.name}
                      onChange={(e) => setMenuItemForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menuDescription">Description</Label>
                    <Input
                      id="menuDescription"
                      value={menuItemForm.description}
                      onChange={(e) => setMenuItemForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menuPrice">Price</Label>
                    <Input
                      id="menuPrice"
                      type="number"
                      step="0.01"
                      value={menuItemForm.price}
                      onChange={(e) => setMenuItemForm(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleAddMenuItem} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {editingMenuItem ? 'Update Item' : 'Add Item'}
                  </Button>
                </CardContent>
              </Card>

              <div>
                <h4 className="mb-4">Current Menu Items</h4>
                <div className="space-y-2">
                  {currentRestaurantMenuItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-sm text-green-600">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMenuItem(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMenuItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {currentRestaurantMenuItems.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No menu items yet</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setIsMenuDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
