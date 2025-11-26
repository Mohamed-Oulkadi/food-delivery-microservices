import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'CUSTOMER', // Default role
        restaurantId: undefined as number | undefined
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await userService.post('/api/users/register', formData);
            navigate('/login');
        } catch (err: any) {
            console.error('Registration failed:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-20 max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <Input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Choose a username"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Create a password"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">I am a...</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="DRIVER">Driver</option>
                                <option value="ROLE_RESTAURANT_OWNER">Restaurant Owner</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        {formData.role === 'ROLE_RESTAURANT_OWNER' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Restaurant ID</label>
                                <Input
                                    type="number"
                                    name="restaurantId"
                                    value={formData.restaurantId || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        restaurantId: e.target.value ? parseInt(e.target.value) : undefined
                                    }))}
                                    required
                                    placeholder="Enter your restaurant ID"
                                />
                                <p className="text-xs text-slate-500">Contact admin to get your restaurant ID</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>

                        <div className="text-center text-sm text-slate-500 mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-emerald-600 hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;
