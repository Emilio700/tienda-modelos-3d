import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * ProtectedRoute - Componente HOC para proteger rutas
 * Redirige a la landing page si el usuario no está autenticado
 */
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh'
            }}>
                <div style={{
                    fontSize: 'var(--font-size-xl)',
                    color: 'var(--color-text-secondary)'
                }}>
                    Cargando...
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirigir a la landing page
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    // Si está autenticado, mostrar el contenido
    return children;
}

export default ProtectedRoute;
