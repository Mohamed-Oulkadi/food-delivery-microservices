import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight, Truck } from 'lucide-react';
import { userService } from '../api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

interface Driver {
    userId: number;
    username: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    role: string;
    active: boolean;
    createdAt: string;
    updatedAt?: string;
}

const DriverManagement: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        role: 'ROLE_DRIVER'
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = drivers.filter(d =>
            (d.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredDrivers(filtered);
        } else {
            setFilteredDrivers(drivers);
        }
    }, [searchTerm, drivers]);

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            const response = await userService.get('/api/users');
            // Filter only drivers
            const driverUsers = (response.data || []).filter((user: Driver) =>
                user.role === 'ROLE_DRIVER'
            );
            setDrivers(driverUsers);
        } catch (err) {
            console.error('Failed to fetch drivers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingDriver(null);
        setFormData({ username: '', email: '', password: '', phoneNumber: '', address: '', role: 'ROLE_DRIVER' });
        setShowForm(true);
    };

    const handleEdit = (driver: Driver) => {
        setEditingDriver(driver);
        setFormData({
            username: driver.username,
            email: driver.email,
            password: '', // Don't populate password for security
            phoneNumber: driver.phoneNumber || '',
            address: driver.address || '',
            role: driver.role
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this driver? This action cannot be undone.')) return;

        try {
            await userService.delete(`/api/users/${id}`);
            await fetchDrivers();
        } catch (err) {
            console.error('Failed to delete driver:', err);
            alert('Failed to delete driver');
        }
    };

    const handleToggleActive = async (driver: Driver) => {
        try {
            await userService.put(`/api/users/${driver.userId}`, {
                ...driver,
                active: !driver.active
            });
            await fetchDrivers();
        } catch (err) {
            console.error('Failed to toggle driver status:', err);
            alert('Failed to update driver status');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingDriver) {
                // Update existing driver
                await userService.put(`/api/users/${editingDriver.userId}`, {
                    username: formData.username,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                    role: formData.role,
                    active: editingDriver.active
                });
            } else {
                // Create new driver
                await userService.post('/api/users/register', {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                    role: 'ROLE_DRIVER'
                });
            }

            setShowForm(false);
            await fetchDrivers();
        } catch (err) {
            console.error('Failed to save driver:', err);
            alert('Failed to save driver');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-200 rounded-lg" />
                ))}
            </div>
        );
    }

    if (showForm) {
        return (
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>{editingDriver ? 'Edit Driver' : 'Add Driver'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Username</label>
                                <Input
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    placeholder="Enter username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="Enter email"
                                />
                            </div>
                        </div>

                        {!editingDriver && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="Enter password"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone Number</label>
                                <Input
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Address</label>
                                <Input
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                {editingDriver ? 'Update' : 'Add'} Driver
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search drivers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Driver
                </Button>
            </div>

            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle>Drivers ({filteredDrivers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredDrivers.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            {searchTerm ? 'No drivers found matching your search.' : 'No drivers yet. Add your first driver!'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Driver</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Contact</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Registered</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDrivers.map((driver) => (
                                        <tr key={driver.userId} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                        <Truck className="h-5 w-5 text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{driver.username}</div>
                                                        <div className="text-sm text-slate-500">{driver.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm">
                                                    <div className="text-slate-900">{driver.phoneNumber || 'N/A'}</div>
                                                    <div className="text-slate-500 truncate max-w-xs">{driver.address || 'No address'}</div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">
                                                {formatDate(driver.createdAt)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant={driver.active ? 'default' : 'secondary'}>
                                                    {driver.active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleToggleActive(driver)}
                                                        className={driver.active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                                                    >
                                                        {driver.active ? (
                                                            <ToggleRight className="h-4 w-4" />
                                                        ) : (
                                                            <ToggleLeft className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(driver)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(driver.userId)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DriverManagement;
