import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * PublicRoute - Componente para rutas públicas
 * Redirige a /store si el usuario ya está autenticado
 */
function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    // Mostrar loading mientras se verifica
    if (loading) {
        return null;
    }

    // Si está autenticado, redirigir a la tienda
    if (isAuthenticated()) {
        return <Navigate to="/store" replace />;
    }

    // Si no está autenticado, mostrar el contenido (landing page)
    return children;
}

export default PublicRoute;
