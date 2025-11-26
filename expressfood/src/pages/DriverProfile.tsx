import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const DriverProfile: React.FC = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
            });
        }
    }, [user]);

    const isProfileComplete = formData.phoneNumber && formData.address;

    const handleSave = async () => {
        // Validate required fields
        if (!formData.phoneNumber || !formData.address) {
            setMessage({ type: 'error', text: 'Phone number and address are required to complete your profile.' });
            return;
        }

        try {
            setSaving(true);
            setMessage(null);

            // Update user profile
            await userService.put(`/api/users/${user?.id}`, {
                username: formData.username,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                role: user?.role,
                active: user?.active ?? true
            });

            // Update local user state
            const updatedUser = {
                ...user!,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
            };
            updateUser(updatedUser);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // If profile just became complete, redirect to dashboard after a short delay
            if (formData.phoneNumber && formData.address && user?.role === 'ROLE_DRIVER') {
                setTimeout(() => {
                    navigate('/driver/dashboard');
                }, 1500);
            }
        } catch (err) {
            console.error('Failed to update profile:', err);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Driver Profile</h1>
                <p className="text-slate-600">Complete your profile to start accepting deliveries</p>
            </div>

            {/* Profile Completion Alert */}
            {!isProfileComplete && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-amber-900 mb-1">Complete Your Profile</h3>
                        <p className="text-sm text-amber-700">
                            Please add your phone number and address to start accepting delivery orders.
                        </p>
                    </div>
                </div>
            )}

            {/* Success/Error Message */}
            {message && (
                <div className={`mb-6 rounded-lg p-4 flex items-start gap-3 ${message.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-red-50 border border-red-200'
                    }`}>
                    {message.type === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <p className={`text-sm ${message.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {message.text}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {/* Main Profile Card */}
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Profile Header */}
                        <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                            <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center">
                                <User className="h-12 w-12 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{user?.username}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge className="bg-emerald-100 text-emerald-800">Driver</Badge>
                                    {isProfileComplete ? (
                                        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Profile Complete
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            Incomplete
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Username</label>
                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <User className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">{formData.username}</span>
                                </div>
                                <p className="text-xs text-slate-500">Username cannot be changed</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">{formData.email}</span>
                                </div>
                                <p className="text-xs text-slate-500">Email cannot be changed</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <Input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        placeholder="Enter your phone number"
                                        className="border-none p-0 focus:ring-0 bg-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <Input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Enter your address"
                                        className="border-none p-0 focus:ring-0 bg-transparent"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4 border-t border-slate-100 flex gap-3">
                            <Button
                                onClick={handleSave}
                                disabled={saving || !formData.phoneNumber || !formData.address}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? 'Saving...' : 'Save Profile'}
                            </Button>
                            {isProfileComplete && (
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/driver/dashboard')}
                                >
                                    Go to Dashboard
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DriverProfile;
