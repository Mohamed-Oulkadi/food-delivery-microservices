import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Store, Bike } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminProvider';

export const DashboardView = () => {
  const { users, restaurants, menuItems } = useAdmin();
  const clients = users.filter(u => u.role === 'ROLE_CUSTOMER');
  const livreurs = users.filter(u => u.role === 'ROLE_DRIVER');
  const admins = users.filter(u => u.role === 'ROLE_ADMIN');

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Clients Card */}
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Clients</p>
                <h3 className="text-3xl font-bold text-gray-900">{clients.length}</h3>
                <p className="text-xs text-gray-500 mt-1">Active users on platform</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Restaurants Card */}
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Restaurants</p>
                <h3 className="text-3xl font-bold text-gray-900">{restaurants.length}</h3>
                <p className="text-xs text-gray-500 mt-1">Partner restaurants</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Store className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Livreurs Card */}
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Livreurs</p>
                <h3 className="text-3xl font-bold text-gray-900">{livreurs.length}</h3>
                <p className="text-xs text-gray-500 mt-1">Delivery personnel available</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Bike className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Users Card */}
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-900">{users.length}</h3>
                <p className="text-xs text-gray-500 mt-1">All registered users</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Card */}
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    {restaurants.length} Restaurants Registered
                  </p>
                  <p className="text-xs text-gray-500">Active partner restaurants</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    {clients.length} Active Clients
                  </p>
                  <p className="text-xs text-gray-500">Platform users</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    {livreurs.length} Delivery Personnel
                  </p>
                  <p className="text-xs text-gray-500">Available livreurs</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700 font-medium">Total Menu Items</span>
                <span className="text-2xl font-bold text-gray-900">{menuItems.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700 font-medium">System Admins</span>
                <span className="text-2xl font-bold text-gray-900">{admins.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700 font-medium">Avg. Items/Restaurant</span>
                <span className="text-2xl font-bold text-gray-900">
                  {restaurants.length > 0 ? (menuItems.length / restaurants.length).toFixed(1) : '0.0'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};