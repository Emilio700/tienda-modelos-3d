import { createContext, useContext } from 'react';
import { useState, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    // Detectar usuario actual para separar wishlists
    const [userId, setUserId] = useState(() => {
        const savedUser = localStorage.getItem('auth-user');
        return savedUser ? JSON.parse(savedUser).id : 'guest';
    });

    useEffect(() => {
        const handleAuthChange = () => {
            const savedUser = localStorage.getItem('auth-user');
            setUserId(savedUser ? JSON.parse(savedUser).id : 'guest');
        };

        window.addEventListener('auth-change', handleAuthChange);
        window.addEventListener('storage', handleAuthChange);

        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
            window.removeEventListener('storage', handleAuthChange);
        };
    }, []);

    const wishlistKey = `3d-models-wishlist-${userId}`;

    const [wishlist, setWishlist] = useLocalStorage(wishlistKey, []);

    // Agregar producto a la wishlist
    const addToWishlist = useCallback((product) => {
        setWishlist(currentWishlist => {
            const exists = currentWishlist.some(item => item.id === product.id);
            if (!exists) {
                return [...currentWishlist, product];
            }
            return currentWishlist;
        });
    }, [setWishlist]);

    // Eliminar producto de la wishlist
    const removeFromWishlist = useCallback((productId) => {
        setWishlist(currentWishlist => currentWishlist.filter(item => item.id !== productId));
    }, [setWishlist]);

    // Toggle producto en wishlist
    const toggleWishlist = useCallback((product) => {
        setWishlist(currentWishlist => {
            const exists = currentWishlist.some(item => item.id === product.id);
            if (exists) {
                return currentWishlist.filter(item => item.id !== product.id);
            } else {
                return [...currentWishlist, product];
            }
        });
    }, [setWishlist]);

    // Verificar si un producto está en la wishlist
    const isInWishlist = useCallback((productId) => {
        return wishlist.some(item => item.id === productId);
    }, [wishlist]);

    // Limpiar wishlist
    const clearWishlist = useCallback(() => {
        setWishlist([]);
    }, [setWishlist]);

    const value = {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
