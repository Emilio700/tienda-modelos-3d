import { createContext, useContext } from 'react';
import { useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const CartContext = createContext();

export function CartProvider({ children }) {
    // Usar localStorage para persistir el carrito
    const [cart, setCart] = useLocalStorage('3d-models-cart', []);

    // Agregar producto al carrito
    const addToCart = useCallback((product, quantity = 1) => {
        setCart(currentCart => {
            // Verificar si el producto ya existe en el carrito
            const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

            if (existingItemIndex > -1) {
                // Si existe, actualizar la cantidad
                const updatedCart = [...currentCart];
                updatedCart[existingItemIndex].quantity += quantity;
                return updatedCart;
            } else {
                // Si no existe, agregarlo
                return [...currentCart, { ...product, quantity }];
            }
        });
    }, [setCart]);

    // Eliminar producto del carrito
    const removeFromCart = useCallback((productId) => {
        setCart(currentCart => currentCart.filter(item => item.id !== productId));
    }, [setCart]);

    // Actualizar cantidad de un producto
    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart(currentCart => {
            const updatedCart = currentCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            );
            return updatedCart;
        });
    }, [setCart, removeFromCart]);

    // Vaciar el carrito
    const clearCart = useCallback(() => {
        setCart([]);
    }, [setCart]);

    // Calcular total de items en el carrito
    const getItemCount = useCallback(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    // Calcular subtotal del carrito
    const getSubtotal = useCallback(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    // Calcular impuestos (16%)
    const getTax = useCallback(() => {
        return getSubtotal() * 0.16;
    }, [getSubtotal]);

    // Calcular envío (gratis si es mayor a $1000, si no $150)
    const getShipping = useCallback(() => {
        const subtotal = getSubtotal();
        return subtotal > 1000 ? 0 : 150;
    }, [getSubtotal]);

    // Calcular total final
    const getTotal = useCallback(() => {
        return getSubtotal() + getTax() + getShipping();
    }, [getSubtotal, getTax, getShipping]);

    // Verificar si un producto está en el carrito
    const isInCart = useCallback((productId) => {
        return cart.some(item => item.id === productId);
    }, [cart]);

    // Obtener cantidad de un producto específico
    const getProductQuantity = useCallback((productId) => {
        const item = cart.find(item => item.id === productId);
        return item ? item.quantity : 0;
    }, [cart]);

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        getTax,
        getShipping,
        getTotal,
        isInCart,
        getProductQuantity
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
