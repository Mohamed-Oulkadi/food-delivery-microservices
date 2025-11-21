import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight, User } from 'lucide-react';
import { userService } from '../api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

interface Customer {
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

const CustomerManagement: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        role: 'ROLE_CUSTOMER'
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = customers.filter(c =>
            (c.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredCustomers(filtered);
        } else {
            setFilteredCustomers(customers);
        }
    }, [searchTerm, customers]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await userService.get('/api/users');
            // Filter only customers (not admins or drivers)
            const customerUsers = (response.data || []).filter((user: Customer) =>
                user.role === 'ROLE_CUSTOMER'
            );
            setCustomers(customerUsers);
        } catch (err) {
            console.error('Failed to fetch customers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCustomer(null);
        setFormData({ username: '', email: '', password: '', phoneNumber: '', address: '', role: 'ROLE_CUSTOMER' });
        setShowForm(true);
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormData({
            username: customer.username,
            email: customer.email,
            password: '', // Don't populate password for security
            phoneNumber: customer.phoneNumber || '',
            address: customer.address || '',
            role: customer.role
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;

        try {
            await userService.delete(`/api/users/${id}`);
            await fetchCustomers();
        } catch (err) {
            console.error('Failed to delete customer:', err);
            alert('Failed to delete customer');
        }
    };

    const handleToggleActive = async (customer: Customer) => {
        try {
            await userService.put(`/api/users/${customer.userId}`, {
                ...customer,
                active: !customer.active
            });
            await fetchCustomers();
        } catch (err) {
            console.error('Failed to toggle customer status:', err);
            alert('Failed to update customer status');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingCustomer) {
                // Update existing customer
                await userService.put(`/api/users/${editingCustomer.userId}`, {
                    username: formData.username,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                    role: formData.role,
                    active: editingCustomer.active
                });
            } else {
                // Create new customer
                await userService.post('/api/users/register', {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                    role: 'ROLE_CUSTOMER'
                });
            }

            setShowForm(false);
            await fetchCustomers();
        } catch (err) {
            console.error('Failed to save customer:', err);
            alert('Failed to save customer');
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
                    <CardTitle>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</CardTitle>
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

                        {!editingCustomer && (
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
                                {editingCustomer ? 'Update' : 'Add'} Customer
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
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                </Button>
            </div>

            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredCustomers.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            {searchTerm ? 'No customers found matching your search.' : 'No customers yet. Add your first customer!'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Customer</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Contact</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Registered</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.userId} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                        <User className="h-5 w-5 text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{customer.username}</div>
                                                        <div className="text-sm text-slate-500">{customer.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm">
                                                    <div className="text-slate-900">{customer.phoneNumber || 'N/A'}</div>
                                                    <div className="text-slate-500 truncate max-w-xs">{customer.address || 'No address'}</div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">
                                                {formatDate(customer.createdAt)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant={customer.active ? 'default' : 'secondary'}>
                                                    {customer.active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleToggleActive(customer)}
                                                        className={customer.active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                                                    >
                                                        {customer.active ? (
                                                            <ToggleRight className="h-4 w-4" />
                                                        ) : (
                                                            <ToggleLeft className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(customer)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(customer.userId)}
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

export default CustomerManagement;
