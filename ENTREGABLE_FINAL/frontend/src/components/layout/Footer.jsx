import { Link } from 'react-router-dom';
import './../../styles/components/footer.css';

/**
 * Componente Footer con información y enlaces
 */
function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__container">
                    <div className="footer__section">
                        <h3 className="footer__title">3D Models Store</h3>
                        <p className="footer__text">
                            Tu tienda online de confianza para modelos de impresión 3D de alta calidad.
                            Descubre miles de diseños únicos para tus proyectos.
                        </p>
                        <div className="footer__social">
                            <a
                                href="#"
                                className="footer__social-link"
                                aria-label="Facebook"
                            >
                                📘
                            </a>
                            <a
                                href="#"
                                className="footer__social-link"
                                aria-label="Instagram"
                            >
                                📸
                            </a>
                            <a
                                href="#"
                                className="footer__social-link"
                                aria-label="Twitter"
                            >
                                🐦
                            </a>
                            <a
                                href="#"
                                className="footer__social-link"
                                aria-label="YouTube"
                            >
                                📹
                            </a>
                        </div>
                    </div>

                    <div className="footer__section">
                        <h3 className="footer__title">Enlaces Rápidos</h3>
                        <ul className="footer__list">
                            <li>
                                <Link to="/store" className="footer__link">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="footer__link">
                                    Carrito
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="footer__link">
                                    Mis Pedidos
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="footer__link">
                                    Devoluciones
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer__section">
                        <h3 className="footer__title">Información</h3>
                        <ul className="footer__list">
                            <li>
                                <a href="#" className="footer__link">
                                    Sobre Nosotros
                                </a>
                            </li>
                            <li>
                                <a href="#" className="footer__link">
                                    Términos y Condiciones
                                </a>
                            </li>
                            <li>
                                <a href="#" className="footer__link">
                                    Política de Privacidad
                                </a>
                            </li>
                            <li>
                                <a href="#" className="footer__link">
                                    Contacto
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer__section">
                        <h3 className="footer__title">Soporte</h3>
                        <ul className="footer__list">
                            <li>
                                <a href="#" className="footer__link">
                                    Preguntas Frecuentes
                                </a>
                            </li>
                            <li>
                                <a href="#" className="footer__link">
                                    Guía de Impresión 3D
                                </a>
                            </li>
                            <li>
                                <a href="#" className="footer__link">
                                    Formatos de Archivo
                                </a>
                            </li>
                            <li>
                                <a href="#" className="footer__link">
                                    Ayuda
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>© {currentYear} 3D Models Store. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
