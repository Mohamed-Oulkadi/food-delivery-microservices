import React, { useState } from 'react';
import { User, Phone, Mail, Car, CreditCard, Shield, Power, Edit2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const DriverProfile: React.FC = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    // Mock data - in a real app, this would come from an API
    const [profile, setProfile] = useState({
        phone: '+1 (555) 123-4567',
        email: user?.username || 'driver@example.com',
        vehicleType: 'Toyota Camry',
        licensePlate: 'ABC-1234',
        bankAccount: '**** **** **** 4321',
        earnings: 1250.50,
        rating: 4.8,
        totalDeliveries: 142
    });

    const handleSave = () => {
        setIsEditing(false);
        // API call to save profile would go here
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Driver Profile</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className={`h-3 w-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-sm font-medium text-slate-600">{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                    <Button
                        variant={isOnline ? "outline" : "default"}
                        onClick={() => setIsOnline(!isOnline)}
                        className={isOnline ? "border-slate-200" : "bg-emerald-600 hover:bg-emerald-700"}
                    >
                        <Power className="h-4 w-4 mr-2" />
                        {isOnline ? 'Go Offline' : 'Go Online'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Profile Card */}
                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                            {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                            <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <User className="h-12 w-12" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{user?.username}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge className="bg-emerald-100 text-emerald-800">Verified Driver</Badge>
                                    <Badge className="bg-blue-100 text-blue-800">{profile.rating} ★ Rating</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-500">Email Address</label>
                                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span>{profile.email}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-500">Phone Number</label>
                                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{profile.phone}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Card */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Vehicle Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <Car className="h-8 w-8 text-slate-400" />
                                <div>
                                    <p className="font-medium">{profile.vehicleType}</p>
                                    <p className="text-sm text-slate-500">{profile.licensePlate}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Earnings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-4">
                                <p className="text-sm text-slate-500 mb-1">Total Earnings</p>
                                <p className="text-3xl font-bold text-emerald-600">${profile.earnings.toFixed(2)}</p>
                                <p className="text-xs text-slate-400 mt-2">{profile.totalDeliveries} deliveries completed</p>
                            </div>
                            <Button className="w-full mt-4" variant="outline">View Payouts</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DriverProfile;
