import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, MenuItem } from '../types';

interface CartContextType {
    items: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (itemId: string | number) => void;
    updateQuantity: (itemId: string | number, quantity: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isOpen, setIsOpen] = useState(false);

    // Save cart to local storage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (item: MenuItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => String(i.id) === String(item.id));
            if (existing) {
                return prev.map((i) =>
                    String(i.id) === String(item.id) ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsOpen(true); // Open cart when adding item
    };

    const removeFromCart = (itemId: string | number) => {
        setItems((prev) => prev.filter((i) => String(i.id) !== String(itemId)));
    };

    const updateQuantity = (itemId: string | number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (String(i.id) === String(itemId) ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total,
                itemCount,
                isOpen,
                setIsOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
