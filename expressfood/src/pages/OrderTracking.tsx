import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Truck, Package, ChefHat, Home, CheckCircle } from 'lucide-react';
import { deliveryService } from '../api/axios';
import type { Delivery } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const steps = [
    { id: 'PENDING', label: 'Order Placed', icon: Package },
    { id: 'PREPARING', label: 'Preparing', icon: ChefHat },
    { id: 'IN_TRANSIT', label: 'Out for Delivery', icon: Truck },
    { id: 'DELIVERED', label: 'Delivered', icon: Home },
];

const OrderTracking: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [status, setStatus] = useState<string>('PENDING');
    const [delivery, setDelivery] = useState<Delivery | null>(null);

    useEffect(() => {
        // Poll for delivery status
        const fetchStatus = async () => {
            try {
                const response = await deliveryService.get<Delivery>(`/api/deliveries/order/${id}`);
                setDelivery(response.data);
                if (response.data.status) {
                    setStatus(response.data.status);
                }
            } catch (err) {
                console.error('Failed to fetch delivery status:', err);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 10000); // Poll every 10s

        // Mock simulation for demo purposes if backend is not reachable
        const mockInterval = setInterval(() => {
            setStatus(prev => {
                if (prev === 'PENDING') return 'PREPARING';
                if (prev === 'PREPARING') return 'IN_TRANSIT';
                if (prev === 'IN_TRANSIT') return 'DELIVERED';
                return prev;
            });
        }, 5000);

        return () => {
            clearInterval(interval);
            clearInterval(mockInterval);
        };
    }, [id]);

    const getCurrentStepIndex = () => {
        if (status === 'PICKED_UP') return 2; // Map to IN_TRANSIT step
        if (status === 'COMPLETED') return 3; // Map to DELIVERED step
        const index = steps.findIndex(s => s.id === status);
        return index === -1 ? 0 : index;
    };

    const currentStepIndex = getCurrentStepIndex();

    // Only show steps up to IN_TRANSIT if order hasn't been picked up yet
    // Show all steps only when status is IN_TRANSIT or DELIVERED
    const getVisibleSteps = () => {
        if (status === 'PENDING' || status === 'PREPARING' || status === 'CONFIRMED') {
            // Only show Order Placed and Preparing
            return steps.filter(s => s.id === 'PENDING' || s.id === 'PREPARING');
        }
        // Show all steps when driver has picked up (IN_TRANSIT) or delivered
        return steps;
    };

    const visibleSteps = getVisibleSteps();

    // Debug: Log the current status to help troubleshoot
    console.log('Order Tracking - Current Status:', status);
    console.log('Order Tracking - Current Step Index:', currentStepIndex);
    console.log('Order Tracking - Visible Steps:', visibleSteps.map(s => s.id));

    const confirmDelivery = async () => {
        if (!delivery) return;
        try {
            // 1. Update delivery status to COMPLETED
            // Note: Backend returns 'deliveryId' not 'id'
            const delivId = (delivery as any).deliveryId || delivery.id;
            await deliveryService.put(`/api/deliveries/${delivId}/status`, {
                status: 'COMPLETED'
            });

            // 2. ALSO update the order status to COMPLETED in OrderService
            // This is important so MyOrders page shows it in "Delivered" tab
            const { orderService } = await import('../api/axios');
            await orderService.put(`/api/orders/${id}/status`, {
                status: 'COMPLETED'
            });

            // 3. Refresh status immediately
            const response = await deliveryService.get<Delivery>(`/api/deliveries/order/${id}`);
            setDelivery(response.data);
            setStatus(response.data.status);
        } catch (err) {
            console.error('Failed to confirm delivery:', err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 pb-20 max-w-3xl">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
                <p className="text-slate-500">Order ID: {id}</p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="relative flex justify-between">
                        {/* Progress Bar Background */}
                        <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 -z-10" />

                        {/* Active Progress Bar */}
                        <div
                            className="absolute top-5 left-0 h-1 bg-emerald-600 -z-10 transition-all duration-500"
                            style={{ width: `${(currentStepIndex / (visibleSteps.length - 1)) * 100}%` }}
                        />

                        {visibleSteps.map((step, index) => {
                            const Icon = step.icon;
                            // Make both PENDING and PREPARING active when order is in initial states
                            // This gives better visual feedback that the order is being prepared
                            let isActive = false;

                            if (step.id === 'PENDING') {
                                // PENDING icon is always active (green)
                                isActive = true;
                            } else {
                                // Other steps use normal progression logic
                                isActive = index <= currentStepIndex;
                            }

                            return (
                                <div key={step.id} className="flex flex-col items-center bg-white px-2">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                                            isActive ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-400"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span
                                        className={cn(
                                            "mt-2 text-sm font-medium transition-colors duration-300",
                                            isActive ? "text-emerald-600" : "text-slate-400"
                                        )}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {status === 'COMPLETED' && (
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Order Completed!</h2>
                    <p className="text-slate-500">Thank you for your order.</p>
                    <Button size="lg" onClick={() => window.location.href = '/'}>
                        Order Again
                    </Button>
                </div>
            )}

            {status !== 'COMPLETED' && (
                <div className="text-center space-y-4">


                    {(status === 'IN_TRANSIT' || status === 'PICKED_UP') && (
                        <div className="pt-4 animate-in fade-in slide-in-from-bottom-4">
                            <Card className="bg-emerald-50 border-emerald-100">
                                <CardContent className="p-6">
                                    <div className="text-center space-y-4">
                                        <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Truck className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-emerald-900">Delivery in Progress</h3>
                                        <p className="text-emerald-700">Your order is on the way.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {status === 'DELIVERED' && (
                        <div className="pt-4 animate-in fade-in slide-in-from-bottom-4">
                            <Card className="bg-emerald-50 border-emerald-100">
                                <CardContent className="p-6">
                                    <div className="text-center space-y-4">
                                        <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-emerald-900">Order Delivered!</h3>
                                        <p className="text-emerald-700">Please confirm that you have received your order.</p>
                                        <Button
                                            onClick={confirmDelivery}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                                            size="lg"
                                        >
                                            Confirm Receipt
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
