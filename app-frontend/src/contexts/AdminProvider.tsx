import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Restaurant, MenuItem, UserDto } from '../lib/mockData';
import { 
  getRestaurants, 
  getMenuItems, 
  uploadRestaurantImage, 
  uploadMenuItemImage, 
  getUsers, 
  updateUser, 
  deleteUser 
} from '../services/api';
import { toast } from 'sonner';

interface AdminContextType {
  isLoading: boolean;
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  users: UserDto[];
  clients: UserDto[];
  livreurs: UserDto[];
  admins: UserDto[];
  isRestaurantDialogOpen: boolean;
  setIsRestaurantDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingRestaurant: Restaurant | null;
  setEditingRestaurant: React.Dispatch<React.SetStateAction<Restaurant | null>>;
  isMenuDialogOpen: boolean;
  setIsMenuDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingMenuItem: MenuItem | null;
  setEditingMenuItem: React.Dispatch<React.SetStateAction<MenuItem | null>>;
  isUserDialogOpen: boolean;
  setIsUserDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingUser: UserDto | null;
  setEditingUser: React.Dispatch<React.SetStateAction<UserDto | null>>;
  selectedRestaurantId: string;
  setSelectedRestaurantId: React.Dispatch<React.SetStateAction<string>>;
  restaurantForm: { name: string; cuisineType: string; address: string };
  setRestaurantForm: React.Dispatch<React.SetStateAction<{ name: string; cuisineType: string; address: string }>>;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  selectedMenuItemFile: File | null;
  setSelectedMenuItemFile: React.Dispatch<React.SetStateAction<File | null>>;
  menuItemForm: { name: string; description: string; price: string };
  setMenuItemForm: React.Dispatch<React.SetStateAction<{ name: string; description: string; price: string }>>;
  userForm: { username: string; email: string; role: string };
  setUserForm: React.Dispatch<React.SetStateAction<{ username: string; email: string; role: string }>>;
  handleAddRestaurant: () => void;
  handleEditRestaurant: (restaurant: Restaurant) => void;
  handleSaveRestaurant: () => Promise<void>;
  handleDeleteRestaurant: (id: string) => void;
  handleManageMenu: (restaurantId: string) => void;
  handleAddMenuItem: () => Promise<void>;
  handleEditMenuItem: (menuItem: MenuItem) => void;
  handleDeleteMenuItem: (id: string) => void;
  handleEditUser: (user: UserDto) => void;
  handleSaveUser: () => Promise<void>;
  handleDeleteUser: (id: number) => Promise<void>;
  currentRestaurantMenuItems: MenuItem[];
  currentRestaurant: Restaurant | undefined;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);

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

  const value = {
    isLoading,
    restaurants,
    menuItems,
    users,
    clients,
    livreurs,
    admins,
    isRestaurantDialogOpen,
    setIsRestaurantDialogOpen,
    editingRestaurant,
    setEditingRestaurant,
    isMenuDialogOpen,
    setIsMenuDialogOpen,
    editingMenuItem,
    setEditingMenuItem,
    isUserDialogOpen,
    setIsUserDialogOpen,
    editingUser,
    setEditingUser,
    selectedRestaurantId,
    setSelectedRestaurantId,
    restaurantForm,
    setRestaurantForm,
    selectedFile,
    setSelectedFile,
    selectedMenuItemFile,
    setSelectedMenuItemFile,
    menuItemForm,
    setMenuItemForm,
    userForm,
    setUserForm,
    handleAddRestaurant,
    handleEditRestaurant,
    handleSaveRestaurant,
    handleDeleteRestaurant,
    handleManageMenu,
    handleAddMenuItem,
    handleEditMenuItem,
    handleDeleteMenuItem,
    handleEditUser,
    handleSaveUser,
    handleDeleteUser,
    currentRestaurantMenuItems,
    currentRestaurant,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};