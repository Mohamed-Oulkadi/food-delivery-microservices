import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { getMyOrders, getRestaurantById, getMenuItems } from '../services/api';
import { Order, Restaurant, MenuItem } from '../lib/mockData';
import { useApp } from '../contexts/AppContext';

interface EnrichedOrder extends Order {
  restaurant?: Restaurant;
  enrichedItems?: (Order['items'][0] & { menuItem?: MenuItem })[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'DELIVERED':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'IN_TRANSIT':
      return <Truck className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'DELIVERED':
      return 'default';
    case 'IN_TRANSIT':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const MyOrders: React.FC = () => {
  const { user } = useApp();
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const response = await getMyOrders(user.id);
          const ordersData = response.data;

          const enrichedOrders = await Promise.all(ordersData.map(async (order) => {
            const restaurant = await getRestaurantById(order.restaurantId).then(res => res.data);
            const menuItems = await getMenuItems(order.restaurantId).then(res => res.data);
            const enrichedItems = order.items.map(item => ({
              ...item,
              menuItem: menuItems.find(mi => mi.id === item.menuItemId)
            }));
            return { ...order, restaurant, enrichedItems };
          }));

          setOrders(enrichedOrders);
        } catch (error) {
          console.error('Failed to fetch orders', error);
        }
      };
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-8 w-8 text-green-600" />
          <h1 className="text-gray-900">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">You haven't placed any orders yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {orders.map(order => (
              <AccordionItem key={order.id} value={order.id} className="border-none">
                <Card>
                  <CardHeader>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start justify-between w-full pr-4">
                        <div className="text-left">
                          <CardTitle className="mb-2">{order.restaurant?.name || 'Restaurant'}</CardTitle>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>Order #{order.id}</span>
                            <span>{new Date(order.date).toLocaleDateString()}</span>
                            <span className="text-green-600">${order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="pt-0">
                      <div className="border-t pt-4">
                        <h4 className="text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-2">
                          {order.enrichedItems?.map((item, idx) => {
                            if (!item.menuItem) return null;
                            
                            return (
                              <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div>
                                  <p className="text-gray-900">{item.menuItem.name}</p>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <p className="text-gray-900">
                                  ${(item.menuItem.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};
