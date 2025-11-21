import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
    const { isOpen, setIsOpen, items, removeFromCart, updateQuantity, total } = useCart();
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div className="relative z-50 w-full max-w-md bg-white shadow-xl animate-in slide-in-from-right duration-300 h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Your Cart
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <ShoppingBag className="h-12 w-12 mb-2 opacity-20" />
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="h-20 w-20 rounded-lg object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-sm text-slate-500">${item.price.toFixed(2)}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-xs text-red-500 hover:underline mt-1"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t bg-slate-50">
                    <div className="flex justify-between mb-4 text-lg font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <Button
                        className="w-full"
                        size="lg"
                        disabled={items.length === 0}
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/checkout');
                        }}
                    >
                        Checkout
                    </Button>
                </div>
            </div>
        </div>
    );
};
