import { useCallback, useEffect, useState } from 'react';
import { Truck, Check, MapPin, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Delivery } from '../lib/mockData';
import { toast } from 'sonner@2.0.3';
import { useApp } from '../contexts/AppContext';
import {
  assignDelivery,
  getDriverActiveDeliveries,
  getPendingDeliveries,
  updateDeliveryStatus as updateDeliveryStatusApi,
} from '../services/api';

export const DriverDashboard: React.FC = () => {
  const { user } = useApp();
  const driverId = user?.id ?? '101';

  const [pendingDeliveries, setPendingDeliveries] = useState<Delivery[]>([]);
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const normalizeDeliveries = (items: Delivery[]) =>
    items.map(item => ({
      ...item,
      id:
        item.id ??
        (item.deliveryId ? String(item.deliveryId) : item.orderId ? String(item.orderId) : undefined),
      orderId: typeof item.orderId === 'number' ? String(item.orderId) : item.orderId,
      driverId: item.driverId != null ? String(item.driverId) : undefined,
    }));

  const fetchDeliveries = useCallback(async () => {
    setIsLoading(true);
    try {
      const pendingPromise = getPendingDeliveries();
      const activePromise = driverId
        ? getDriverActiveDeliveries(driverId)
        : Promise.resolve({ data: [] as Delivery[] });

      const [pendingRes, activeRes] = await Promise.all([pendingPromise, activePromise]);

      setPendingDeliveries(normalizeDeliveries(pendingRes.data));
      setActiveDeliveries(normalizeDeliveries(activeRes.data));
    } catch (error) {
      console.error('Failed to load deliveries', error);
      toast.error('Failed to load deliveries');
    } finally {
      setIsLoading(false);
    }
  }, [driverId]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleAcceptDelivery = async (delivery: Delivery) => {
    if (!driverId) {
      toast.error('You must be logged in as a driver to accept deliveries');
      return;
    }
    const resourceId = delivery.deliveryId ?? delivery.id;
    if (!resourceId) {
      toast.error('Missing delivery identifier');
      return;
    }
    const numericDriverId = Number(driverId);
    if (Number.isNaN(numericDriverId)) {
      toast.error('Invalid driver identifier');
      return;
    }

    try {
      await assignDelivery(resourceId, numericDriverId);
      toast.success('Delivery accepted successfully');
      fetchDeliveries();
    } catch (error) {
      console.error('Failed to accept delivery', error);
      toast.error('Failed to accept delivery');
    }
  };

  const handleUpdateStatus = async (delivery: Delivery, newStatus: Delivery['status']) => {
    const resourceId = delivery.deliveryId ?? delivery.id;
    if (!resourceId) {
      toast.error('Missing delivery identifier');
      return;
    }
    try {
      await updateDeliveryStatusApi(String(resourceId), newStatus);
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      fetchDeliveries();
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update status');
    }
  };

  const availableDeliveries = pendingDeliveries;
  const myDeliveries = activeDeliveries;

  useEffect(() => {
    console.debug('Pending deliveries (API):', pendingDeliveries);
    console.debug('Active deliveries (API):', activeDeliveries);
  }, [pendingDeliveries, activeDeliveries]);

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'ACCEPTED':
        return 'bg-blue-500';
      case 'PICKED_UP':
        return 'bg-purple-500';
      case 'IN_TRANSIT':
        return 'bg-orange-500';
      case 'DELIVERED':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Truck className="h-8 w-8 text-green-600" />
          <h1 className="text-gray-900">Driver Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                New Delivery Requests
              </CardTitle>
              <p className="text-sm text-gray-500">
                Backend results: {availableDeliveries.length}
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Loading deliveries...</p>
                </div>
              ) : availableDeliveries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No new deliveries available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableDeliveries.map(delivery => (
                    <div
                      key={delivery.id}
                      className="p-4 bg-gray-50 rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-900">Order #{delivery.orderId}</p>
                          <p className="text-sm text-gray-600">{delivery.restaurantName ?? 'Restaurant TBD'}</p>
                        </div>
                        <Badge className={getStatusColor(delivery.status)}>
                          {delivery.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{delivery.customerAddress ?? 'Address not provided'}</span>
                      </div>

                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleAcceptDelivery(delivery)}
                        disabled={isLoading}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept Delivery
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Current Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                My Active Deliveries
              </CardTitle>
              <p className="text-sm text-gray-500">
                Backend results: {myDeliveries.length}
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Loading deliveries...</p>
                </div>
              ) : myDeliveries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active deliveries</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myDeliveries.map(delivery => (
                    <div
                      key={delivery.id}
                      className="p-4 bg-gray-50 rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-900">
                            Delivery #{delivery.deliveryId ?? delivery.id}
                          </p>
                          <p className="text-sm text-gray-600">Order #{delivery.orderId}</p>
                          <p className="text-sm text-gray-600">{delivery.restaurantName ?? 'Restaurant TBD'}</p>
                        </div>
                        <Badge className={getStatusColor(delivery.status)}>
                          {delivery.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{delivery.customerAddress ?? 'Address not provided'}</span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">Update Status:</label>
                        <Select
                          value={delivery.status}
                          onValueChange={(value) =>
                            handleUpdateStatus(delivery, value as Delivery['status'])
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACCEPTED">Accepted</SelectItem>
                            <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};