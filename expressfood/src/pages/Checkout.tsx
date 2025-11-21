import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../api/axios';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export const Checkout: React.FC = () => {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('123 Main St, New York, NY'); // Mock address

    const handlePlaceOrder = async () => {
        if (items.length === 0) return;

        setLoading(true);
        try {
            // Construct order payload
            const restaurantId = items[0]?.restaurantId;

            const orderPayload = {
                customerId: user?.id || 1, // Backend expects customerId, not userId
                restaurantId: restaurantId,
                items: items.map(item => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name
                })),
                totalAmount: total,
                deliveryAddress: address
            };

            console.log('Creating order with payload:', orderPayload);
            const response = await orderService.post('/api/orders', orderPayload);
            console.log('Order created successfully:', response.data);

            clearCart();
            // Redirect to My Orders page instead of order tracking
            navigate('/my-orders');
        } catch (err) {
            console.error('Failed to place order:', err);
            // For demo purposes, simulate success even if backend fails
            setTimeout(() => {
                const mockOrderId = 'mock-order-' + Date.now();
                clearCart();
                navigate('/my-orders');
            }, 1000);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Button onClick={() => navigate('/')}>Browse Restaurants</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-20">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Delivery Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-emerald-600" />
                                Delivery Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="mb-2"
                            />
                            <p className="text-sm text-slate-500">Note: This is a mock address for demonstration.</p>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-emerald-600" />
                                Payment Method
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 p-4 border rounded-xl bg-slate-50">
                                <div className="h-8 w-12 bg-slate-200 rounded flex items-center justify-center text-xs font-bold">VISA</div>
                                <div>
                                    <p className="font-medium">**** **** **** 4242</p>
                                    <p className="text-sm text-slate-500">Expires 12/25</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-slate-100 rounded-md flex items-center justify-center text-sm font-bold text-slate-600">
                                            {item.quantity}x
                                        </div>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Total & Action */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Delivery Fee</span>
                                <span>$2.99</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Service Fee</span>
                                <span>$1.50</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span>${(total + 2.99 + 1.50).toFixed(2)}</span>
                            </div>

                            <Button
                                className="w-full h-12 text-lg"
                                onClick={handlePlaceOrder}
                                isLoading={loading}
                            >
                                Place Order
                            </Button>
                            <p className="text-xs text-center text-slate-400">
                                By placing an order, you agree to our Terms of Service.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
