import { useState } from 'react';
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

const initialDeliveries: Delivery[] = [
  {
    id: 'DEL-001',
    orderId: 'ORD-101',
    customerAddress: '123 Oak Street, Apt 4B',
    restaurantName: "Amici's Italian Kitchen",
    status: 'PENDING'
  },
  {
    id: 'DEL-002',
    orderId: 'ORD-102',
    customerAddress: '456 Maple Avenue',
    restaurantName: 'Spice of India',
    status: 'PENDING'
  },
  {
    id: 'DEL-003',
    orderId: 'ORD-103',
    customerAddress: '789 Pine Road, Unit 12',
    restaurantName: 'Sushi Paradise',
    status: 'ACCEPTED',
    driverId: 'd1'
  }
];

export const DriverDashboard: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);

  const handleAcceptDelivery = (deliveryId: string) => {
    setDeliveries(prev =>
      prev.map(d =>
        d.id === deliveryId
          ? { ...d, status: 'ACCEPTED', driverId: 'd1' }
          : d
      )
    );
    toast.success('Delivery accepted successfully');
  };

  const handleUpdateStatus = (deliveryId: string, newStatus: Delivery['status']) => {
    setDeliveries(prev =>
      prev.map(d =>
        d.id === deliveryId
          ? { ...d, status: newStatus }
          : d
      )
    );
    toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
  };

  const availableDeliveries = deliveries.filter(d => d.status === 'PENDING');
  const myDeliveries = deliveries.filter(d => d.driverId === 'd1' && d.status !== 'DELIVERED');

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
            </CardHeader>
            <CardContent>
              {availableDeliveries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No new deliveries available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableDeliveries.map(delivery => (
                    <div key={delivery.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-900">Order #{delivery.orderId}</p>
                          <p className="text-sm text-gray-600">{delivery.restaurantName}</p>
                        </div>
                        <Badge className={getStatusColor(delivery.status)}>
                          {delivery.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{delivery.customerAddress}</span>
                      </div>

                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleAcceptDelivery(delivery.id)}
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
            </CardHeader>
            <CardContent>
              {myDeliveries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active deliveries</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myDeliveries.map(delivery => (
                    <div key={delivery.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-900">Delivery #{delivery.id}</p>
                          <p className="text-sm text-gray-600">Order #{delivery.orderId}</p>
                          <p className="text-sm text-gray-600">{delivery.restaurantName}</p>
                        </div>
                        <Badge className={getStatusColor(delivery.status)}>
                          {delivery.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{delivery.customerAddress}</span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">Update Status:</label>
                        <Select
                          value={delivery.status}
                          onValueChange={(value) => handleUpdateStatus(delivery.id, value as Delivery['status'])}
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