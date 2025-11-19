import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Bike,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAdmin } from '../contexts/AdminProvider';
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
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import React from 'react';

export const AdminPage: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const {
    isRestaurantDialogOpen,
    setIsRestaurantDialogOpen,
    editingRestaurant,
    restaurantForm,
    setRestaurantForm,
    selectedFile,
    setSelectedFile,
    handleSaveRestaurant,
    isUserDialogOpen,
    setIsUserDialogOpen,
    editingUser,
    userForm,
    setUserForm,
    handleSaveUser,
    isMenuDialogOpen,
    setIsMenuDialogOpen,
    currentRestaurant,
    menuItemForm,
    setMenuItemForm,
    selectedMenuItemFile,
    setSelectedMenuItemFile,
    editingMenuItem,
    setEditingMenuItem,
    handleAddMenuItem,
    currentRestaurantMenuItems,
    handleEditMenuItem,
    handleDeleteMenuItem,
    handleFileSelect,
  } = useAdmin();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'clients', label: 'Clients', icon: Users, path: '/admin/clients' },
    { id: 'restaurants', label: 'Restaurants', icon: Store, path: '/admin/restaurants' },
    { id: 'livreurs', label: 'Livreurs', icon: Bike, path: '/admin/livreurs' },
  ];

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
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.path
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
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Dialogs */}
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
                onChange={(e) => handleFileSelect(e, 'restaurant')}
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
                    onChange={(e) => handleFileSelect(e, 'menuItem')}
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
                                                  </Button>                      </div>
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