import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/auth';

/**
 * Custom hook para gestionar autenticación
 * Maneja login, logout, registro y estado del usuario
 */
function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem('auth-token');
    const savedUser = localStorage.getItem('auth-user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Iniciar sesión
   */
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Guardar en estado y localStorage
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('auth-user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Registrar nuevo usuario
   */
  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      // Guardar en estado y localStorage (auto-login)
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('auth-user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
  };

  /**
   * Verificar si el usuario está autenticado
   */
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  /**
   * Obtener información del usuario actual
   */
  const getCurrentUser = () => {
    return user;
  };

  /**
   * Obtener token de autenticación
   */
  const getToken = () => {
    return token;
  };

  /**
   * Obtener pedidos del usuario
   */
  const getUserOrders = async () => {
    if (!user || !token) {
      return { success: false, error: 'No autenticado' };
    }

    try {
      const response = await fetch(`${API_URL}/users/${user.id}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener pedidos');
      }

      return { success: true, orders: data.orders };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Crear nuevo pedido
   */
  const createOrder = async (orderData) => {
    if (!user || !token) {
      return { success: false, error: 'No autenticado' };
    }

    try {
      const response = await fetch(`${API_URL}/users/${user.id}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear pedido');
      }

      return { success: true, order: data.order };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUser,
    getToken,
    getUserOrders,
    createOrder,
  };
}

export default useAuth;
