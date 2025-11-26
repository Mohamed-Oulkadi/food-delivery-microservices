import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/axios';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Mail, Phone, MapPin, Save, ArrowLeft } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);
            // Update user in backend
            // Assuming the backend endpoint is PUT /api/users/{id}
            // We need to send the complete user object or partial update depending on backend implementation
            // Based on typical patterns, we'll send the updated fields

            const updatedUserData = {
                ...user,
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                address: formData.address
            };

            // Note: Adjust the endpoint if your backend differs
            await userService.put(`/api/users/${user.id}`, updatedUserData);

            // Update local context
            updateUser(updatedUserData);

            alert('Profile updated successfully!');

            // If user came here because they were blocked from checkout, they might want to go back
            // But usually staying here is fine.
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="p-8 text-center">Please log in to view your profile.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:bg-transparent hover:text-emerald-600"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <User className="h-6 w-6 text-emerald-600" />
                        My Profile
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Full Name
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Address
                            </label>
                            <Input
                                value={formData.email}
                                disabled
                                className="bg-slate-50 text-slate-500"
                            />
                            <p className="text-xs text-slate-500">Email cannot be changed</p>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone Number
                            </label>
                            <Input
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Delivery Address
                            </label>
                            <Input
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Enter your delivery address"
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                disabled={loading}
                            >
                                {loading ? (
                                    'Saving...'
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
