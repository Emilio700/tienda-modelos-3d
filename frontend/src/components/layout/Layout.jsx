import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './../../styles/components/layout.css';

/**
 * Componente Layout que envuelve las páginas de la tienda
 * Proporciona el header y footer, usa Outlet para rutas anidadas
 */
function Layout() {
    return (
        <div className="layout">
            <Header />
            <main className="layout__main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
