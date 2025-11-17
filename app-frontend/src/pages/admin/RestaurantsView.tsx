import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminProvider';

export const RestaurantsView = () => {
  const { restaurants, isLoading, handleAddRestaurant, handleManageMenu, handleEditRestaurant, handleDeleteRestaurant } = useAdmin();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Restaurant Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage partner restaurants and menus</p>
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
                <TableRow>
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
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No restaurants found. Click "Add Restaurant" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  restaurants.map(restaurant => (
                    <TableRow key={restaurant.restaurantId} className="hover:bg-gray-50 transition-colors">
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
};