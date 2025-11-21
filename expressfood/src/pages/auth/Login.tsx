import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            const response = await userService.post('/api/users/login', formData);

            console.log('Login response:', response.data);

            // Generate mock JWT token
            const mockToken = 'mock-jwt-token-' + Date.now();

            // Extract user data - ensure ID is properly set
            const userData = {
                id: response.data.id || response.data.userId || 1,
                username: response.data.username || formData.username,
                email: response.data.email || '',
                name: response.data.name || formData.username,
                role: response.data.role || 'CUSTOMER'
            };

            console.log('Setting user data:', userData);
            login(mockToken, userData);

            // Redirect based on user role
            if (userData.role === 'ROLE_DRIVER') {
                navigate('/driver/dashboard');
            } else if (userData.role === 'ROLE_ADMIN') {
                navigate('/admin'); // Admin dashboard route
            } else {
                navigate('/'); // Customer goes to home
            }
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-20 max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
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
                                placeholder="Enter your username"
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
                                placeholder="Enter your password"
                            />
                        </div>

                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <div className="text-center text-sm text-slate-500 mt-4">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-emerald-600 hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
