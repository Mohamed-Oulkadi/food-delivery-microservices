import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

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

            // Generate mock JWT token
            const mockToken = 'mock-jwt-token-' + Date.now();

            // Extract user data
            const userData = {
                id: response.data.userId?.toString() || response.data.id || '1',
                userId: response.data.userId,
                username: response.data.username || formData.username,
                email: response.data.email || '',
                name: response.data.name || formData.username,
                role: response.data.role || 'CUSTOMER',
                restaurantId: response.data.restaurantId,
                phoneNumber: response.data.phoneNumber || '',
                address: response.data.address || '',
                cnie: response.data.cnie || '',
                vehicle: response.data.vehicle || ''
            };

            login(mockToken, userData);

            // Redirect based on user role
            if (userData.role === 'ROLE_DRIVER') {
                navigate('/driver/dashboard');
            } else if (userData.role === 'ROLE_ADMIN') {
                navigate('/admin');
            } else if (userData.role === 'ROLE_RESTAURANT_OWNER') {
                navigate('/restaurant-owner/dashboard');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your details to access your account."
            imageSrc="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Username</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            <Input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Enter your username"
                                className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20 rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <Link to="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-800 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                                className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20 rounded-xl transition-all"
                            />
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-base shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Signing in...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            Sign In
                            <ArrowRight className="h-5 w-5" />
                        </div>
                    )}
                </Button>



                <div className="text-center mt-8">
                    <p className="text-slate-500 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-emerald-600 font-semibold hover:text-emerald-800 hover:underline transition-all">
                            Create an account
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
