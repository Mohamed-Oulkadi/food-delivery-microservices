import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Restaurant, MenuItem, UserDto, Menu, Order } from '../lib/mockData';
import imageCompression from 'browser-image-compression';
import { 
  getRestaurants, 
  getMenuItems, 
  uploadRestaurantImage, 
  uploadMenuItemImage, 
  getUsers, 
  updateUser, 
  deleteUser,
  getOrders,
  getOrderStats,
  deleteRestaurant,
  createRestaurant,
  updateRestaurant
} from '../services/api';
import { toast } from 'sonner';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

interface AdminContextType {
  isLoading: boolean;
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  users: UserDto[];
  orders: Order[];
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
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
  restaurantForm: { name: string; cuisineType: string; address: string; };
  setRestaurantForm: React.Dispatch<React.SetStateAction<{ name: string; cuisineType: string; address: string; }>>;
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
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>, fileType: 'restaurant' | 'menuItem') => void;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
}

const deriveOrderStats = (ordersData: Order[]): OrderStats => {
  const pendingStatuses = new Set([
    'PENDING',
    'PLACED',
    'ACCEPTED',
    'PREPARING',
    'READY_FOR_PICKUP',
    'DELIVERING',
    'IN_TRANSIT'
  ]);
  const deliveredStatuses = new Set(['DELIVERED']);

  let pending = 0;
  let delivered = 0;

  for (const order of ordersData) {
    const status = (order.status ?? '').toString().toUpperCase();
    if (deliveredStatuses.has(status)) {
      delivered += 1;
    } else if (pendingStatuses.has(status)) {
      pending += 1;
    }
  }

  return {
    totalOrders: ordersData.length,
    pendingOrders: pending,
    deliveredOrders: delivered
  };
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });

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
    address: '',
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
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const restaurantResponse = await getRestaurants();
        const restaurants = restaurantResponse.data;
        setRestaurants(restaurants);

        const allMenuItems: MenuItem[] = [];
        for (const restaurant of restaurants) {
          try {
            const menuItemsResponse = await getMenuItems(restaurant.restaurantId);
            const itemsWithRestaurantId = menuItemsResponse.data.items.map(item => ({
              ...item,
              restaurantId: restaurant.restaurantId,
            }));
            allMenuItems.push(...itemsWithRestaurantId);
          } catch (error) {
            console.error(`Failed to fetch menu items for restaurant ${restaurant.restaurantId}`, error);
          }
        }
        setMenuItems(allMenuItems);

      } catch (error) {
        console.error('Failed to fetch data', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
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

    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        const fetchedOrders = response.data;
        setOrders(fetchedOrders);
        const fallbackStats = deriveOrderStats(fetchedOrders);
        setOrderStats(fallbackStats);

        try {
          const statsResponse = await getOrderStats();
          const serverStats = statsResponse.data;
          if (
            fetchedOrders.length === 0 ||
            serverStats.totalOrders > 0 ||
            serverStats.pendingOrders > 0 ||
            serverStats.deliveredOrders > 0
          ) {
            setOrderStats(serverStats);
          }
        } catch (error) {
          console.error('Failed to fetch order stats', error);
          setOrderStats(fallbackStats);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
        toast.error('Failed to load orders');
        setOrderStats({
          totalOrders: 0,
          pendingOrders: 0,
          deliveredOrders: 0
        });
      }
    };
    fetchOrders();
  }, []);

  // Calculate statistics
  const clients = users.filter(u => u.role === 'ROLE_CUSTOMER');
  const livreurs = users.filter(u => u.role === 'ROLE_DRIVER');
  const admins = users.filter(u => u.role === 'ROLE_ADMIN');
  const { totalOrders, pendingOrders, deliveredOrders } = orderStats;

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
      address: restaurant.address,
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
        // Update existing restaurant
        const updatedRestaurantData = { ...restaurantForm };
        const response = await updateRestaurant(editingRestaurant.restaurantId, updatedRestaurantData);
        let finalRestaurant = response.data;

        if (selectedFile) {
          try {
            const imageUrlResponse = await uploadRestaurantImage(editingRestaurant.restaurantId, selectedFile);
            finalRestaurant = { ...finalRestaurant, imageUrl: imageUrlResponse.data };
          } catch (error) {
            toast.error('Failed to upload image. Restaurant data was updated.');
            console.error('Failed to upload image:', error);
          }
        }

        setRestaurants(prev =>
          prev.map(r => r.restaurantId === finalRestaurant.restaurantId
            ? finalRestaurant
            : r
          )
        );
        toast.success('Restaurant updated successfully');
      } else {
        // Create new restaurant
        const newRestaurantData = {
          ...restaurantForm,
        };
        const response = await createRestaurant(newRestaurantData);
        let finalRestaurant = response.data;

        if (selectedFile) {
          try {
            const imageUrlResponse = await uploadRestaurantImage(finalRestaurant.restaurantId, selectedFile);
            finalRestaurant = { ...finalRestaurant, imageUrl: imageUrlResponse.data };
          } catch (error) {
            toast.error('Failed to upload image for new restaurant.');
            console.error('Failed to upload image for new restaurant:', error);
          }
        }

        setRestaurants(prev => [...prev, finalRestaurant]);
        toast.success('Restaurant added successfully');
      }

      setIsRestaurantDialogOpen(false);
      setEditingRestaurant(null); // Clear editing state after save
      setRestaurantForm({ name: '', cuisineType: '', address: '' }); // Clear form
      setSelectedFile(null); // Clear selected file
    } catch (error) {
      toast.error('Failed to save restaurant');
      console.error('Failed to save restaurant:', error);
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        // Optimistically update the UI
        setRestaurants(prev => prev.filter(r => r.restaurantId !== id));
        setMenuItems(prev => prev.filter(m => m.restaurantId !== id));
        toast.success('Restaurant deleted successfully');

        // Call the API to delete the restaurant
        await deleteRestaurant(id);
      } catch (error) {
        toast.error('Failed to delete restaurant');
        console.error('Failed to delete restaurant:', error);
        // Revert UI changes if API call fails (optional, depending on desired UX)
        // You might want to refetch data or add the restaurant back if the delete failed
      }
    }
  };

  const handleManageMenu = (restaurantId: string) => {
    console.log('handleManageMenu called with restaurantId:', restaurantId);
    setSelectedRestaurantId(restaurantId);
    setEditingMenuItem(null);
    setMenuItemForm({ name: '', description: '', price: '' });
    setSelectedMenuItemFile(null);
    setIsMenuDialogOpen(true);
    console.log('isMenuDialogOpen set to true');
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, fileType: 'restaurant' | 'menuItem') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Please select a JPG, PNG, GIF, or WEBP image.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.info('Image is too large, attempting to compress...');
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        if (fileType === 'restaurant') {
          setSelectedFile(compressedFile);
        } else {
          setSelectedMenuItemFile(compressedFile);
        }
        toast.success('Image compressed and selected.');
      } catch (error) {
        toast.error('Failed to compress image. Please select a smaller file.');
        console.error('Image compression error:', error);
      }
    } else {
      if (fileType === 'restaurant') {
        setSelectedFile(file);
      } else {
        setSelectedMenuItemFile(file);
      }
    }
  };

  const value = {
    isLoading,
    restaurants,
    menuItems,
    users,
    orders,
    totalOrders,
    pendingOrders,
    deliveredOrders,
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
    handleFileSelect,
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