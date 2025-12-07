import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import useAuth from '../../hooks/useAuth';
import './../../styles/components/header.css';

/**
 * Componente Header con navegación, carrito y autenticación
 * Usa useState para el menú móvil, useCart para el contador y useAuth para sesión
 */
function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const wishlistCount = wishlist.length;

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMobileMenu();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container header__container">
                {/* Botón hamburguesa en la esquina izquierda */}
                <button
                    className="header__mobile-toggle"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>

                <Link to="/store" className="header__logo" onClick={closeMobileMenu}>
                    <span className="header__logo-icon">🎨</span>
                    <span>3D Models Store</span>
                </Link>

                <nav className={`header__nav ${mobileMenuOpen ? 'header__nav--open' : ''}`}>
                    <ul className="header__nav-list">
                        <li className="header__nav-item">
                            <NavLink
                                to="/store"
                                className={({ isActive }) =>
                                    `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                                }
                                onClick={closeMobileMenu}
                            >
                                Inicio
                            </NavLink>
                        </li>
                        <li className="header__nav-item">
                            <NavLink
                                to="/orders"
                                className={({ isActive }) =>
                                    `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                                }
                                onClick={closeMobileMenu}
                            >
                                Mis Pedidos
                            </NavLink>
                        </li>
                        <li className="header__nav-item">
                            <NavLink
                                to="/returns"
                                className={({ isActive }) =>
                                    `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                                }
                                onClick={closeMobileMenu}
                            >
                                Devoluciones
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="header__actions">
                    <Link to="/wishlist" className="header__wishlist" onClick={closeMobileMenu}>
                        ❤️
                        {wishlistCount > 0 && (
                            <span className="header__wishlist-badge">{wishlistCount}</span>
                        )}
                    </Link>

                    <Link to="/cart" className="header__cart" onClick={closeMobileMenu}>
                        🛒
                        {itemCount > 0 && (
                            <span className="header__cart-badge">{itemCount}</span>
                        )}
                    </Link>

                    {isAuthenticated() ? (
                        <div className="header__user">
                            <span className="header__user-name">👤 {user?.name}</span>
                            <button className="header__logout" onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="header__login" onClick={closeMobileMenu}>
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
