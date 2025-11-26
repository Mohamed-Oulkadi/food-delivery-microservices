import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { User, Mail, Lock, ArrowRight, Loader2, Store } from 'lucide-react';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'CUSTOMER',
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
        <AuthLayout
            title="Join the Feast"
            subtitle="Create your account to start ordering delicious food."
            imageSrc="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop"
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
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            <Input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Choose a username"
                                className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20 rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                                className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20 rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Create a password"
                                className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20 rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">I am a...</label>
                        <div className="relative">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/20 transition-all appearance-none cursor-pointer"
                            >
                                <option value="CUSTOMER">Customer (I want to order food)</option>
                                <option value="DRIVER">Driver (I want to deliver)</option>
                                <option value="ROLE_RESTAURANT_OWNER">Restaurant Owner (I have a restaurant)</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {formData.role === 'ROLE_RESTAURANT_OWNER' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Restaurant ID</label>
                            <div className="relative group">
                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
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
                                    className="pl-10 h-12 bg-slate-50 border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20 rounded-xl transition-all"
                                />
                            </div>
                            <p className="text-xs text-slate-500 ml-1">Contact admin to get your restaurant ID</p>
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-base shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creating Account...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            Sign Up
                            <ArrowRight className="h-5 w-5" />
                        </div>
                    )}
                </Button>

                <div className="text-center mt-8">
                    <p className="text-slate-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-800 hover:underline transition-all">
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
