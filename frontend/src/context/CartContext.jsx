import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });
    const { showToast } = useToast();

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, productId: product._id, quantity: 1 }];
        });
        showToast('Added to cart');
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, change) => {
        setCart(prev => {
            const next = prev.map(item =>
                item._id === productId ? { ...item, quantity: item.quantity + change } : item
            );
            return next.filter(item => item.quantity > 0);
        });
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
