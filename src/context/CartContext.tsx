'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, SpecialOffer } from '@/lib/types';

interface CartItem {
    item: MenuItem;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    appliedOffer: SpecialOffer | null;
    applyOffer: (offer: SpecialOffer) => void;
    removeOffer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [appliedOffer, setAppliedOffer] = useState<SpecialOffer | null>(null);

    // Load cart from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('street_bites_cart');
        const savedOffer = localStorage.getItem('street_bites_offer');
        if (saved) {
            try {
                setCart(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load cart', e);
            }
        }
        if (savedOffer) {
            try {
                setAppliedOffer(JSON.parse(savedOffer));
            } catch (e) {
                console.error('Failed to load offer', e);
            }
        }
    }, []);

    // Save cart to local storage on change
    useEffect(() => {
        localStorage.setItem('street_bites_cart', JSON.stringify(cart));
        if (appliedOffer) {
            localStorage.setItem('street_bites_offer', JSON.stringify(appliedOffer));
        } else {
            localStorage.removeItem('street_bites_offer');
        }
    }, [cart, appliedOffer]);

    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.item.id === item.id);
            if (existing) {
                return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(i => i.item.id !== itemId));
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => {
            return prev.map(i => {
                if (i.item.id === itemId) {
                    return { ...i, quantity: i.quantity + delta };
                }
                return i;
            }).filter(i => i.quantity > 0);
        });
    };

    const clearCart = () => {
        setCart([]);
        setAppliedOffer(null);
    };

    const applyOffer = (offer: SpecialOffer) => {
        setAppliedOffer(offer);
    };

    const removeOffer = () => {
        setAppliedOffer(null);
    };

    const cartTotal = cart.reduce((sum, i) => {
        let price = i.item.price;
        if (appliedOffer && appliedOffer.itemIds && appliedOffer.itemIds.includes(i.item.id)) {
            const discount = appliedOffer.discountPercentage || 0;
            price = price * (1 - discount / 100);
        }
        return sum + (price * i.quantity);
    }, 0);

    // Round to 2 decimal places
    const formattedTotal = Math.round(cartTotal * 100) / 100;

    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal: formattedTotal, cartCount, appliedOffer, applyOffer, removeOffer }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
