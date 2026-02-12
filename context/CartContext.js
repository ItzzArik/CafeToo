'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cafeTooCart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cafeTooCart', JSON.stringify(cart));
        calculateTotal(cart);
    }, [cart]);

    const calculateTotal = (currentCart) => {
        const newTotal = currentCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotal(newTotal);
    };

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                (cartItem) => cartItem.id === item.id && cartItem.variant === item.variant
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += 1;
                return newCart;
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemId, variant) => {
        setCart((prevCart) => prevCart.filter((item) => !(item.id === itemId && item.variant === variant)));
    };

    const updateQuantity = (itemId, variant, change) => {
        setCart((prevCart) => {
            return prevCart.map((item) => {
                if (item.id === itemId && item.variant === variant) {
                    const newQuantity = Math.max(0, item.quantity + change);
                    return { ...item, quantity: newQuantity };
                }
                return item; // Keep other items unchanged
            }).filter((item) => item.quantity > 0); // Remove if quantity becomes 0
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, total, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
