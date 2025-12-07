import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import '../styles/pages/cart.css';

/**CartPage - Página del carrito de compras
 * Usa useCart para gestionar el carrito
 */
function CartPage() {
    const navigate = useNavigate();
    const {
        cart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getSubtotal,
        getTax,
        getShipping,
        getTotal
    } = useCart();

    if (cart.length === 0) {
        return (
            <div className="container cart-page__empty">
                <div className="cart-page__empty-icon">🛒</div>
                <h2>Tu carrito está vacío</h2>
                <p className="cart-page__empty-subtitle">
                    Agrega productos para comenzar tu compra
                </p>
                <Button variant="primary" onClick={() => navigate('/store')}>
                    Explorar Productos
                </Button>
            </div>
        );
    }

    return (
        <div className="container cart-page">
            <h1 className="cart-page__title">Carrito de Compras</h1>

            <div className="cart-page__layout">
                {/* Items del carrito */}
                <div>
                    <div className="cart-page__items-header">
                        <h2 className="cart-page__items-title">
                            Productos ({cart.length})
                        </h2>
                        <Button variant="secondary" size="small" onClick={clearCart}>
                            Vaciar carrito
                        </Button>
                    </div>

                    {cart.map((item) => (
                        <div key={item.id} className="cart-page__item">
                            <img
                                src={item.images[0]}
                                alt={item.name}
                                className="cart-page__item-image"
                            />

                            <div className="cart-page__item-details">
                                <h3 className="cart-page__item-name">
                                    {item.name}
                                </h3>
                                <p className="cart-page__item-manufacturer">
                                    {item.manufacturer}
                                </p>

                                <div className="cart-page__item-controls">
                                    <div className="cart-page__quantity">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="cart-page__quantity-btn"
                                        >
                                            −
                                        </button>
                                        <span className="cart-page__quantity-value">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="cart-page__quantity-btn"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <span className="cart-page__item-price">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="cart-page__item-remove"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resumen */}
                <div>
                    <div className="cart-page__summary">
                        <h2 className="cart-page__summary-title">Resumen</h2>

                        <div>
                            <div className="cart-page__summary-row">
                                <span className="cart-page__summary-label">Subtotal:</span>
                                <span>${getSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="cart-page__summary-row">
                                <span className="cart-page__summary-label">Impuestos (16%):</span>
                                <span>${getTax().toFixed(2)}</span>
                            </div>
                            <div className="cart-page__summary-row">
                                <span className="cart-page__summary-label">Envío:</span>
                                <span>{getShipping() === 0 ? 'GRATIS' : `$${getShipping().toFixed(2)}`}</span>
                            </div>

                            {getSubtotal() < 1000 && (
                                <p className="cart-page__free-shipping-notice">
                                    💡 Agrega ${(1000 - getSubtotal()).toFixed(2)} más para envío gratis
                                </p>
                            )}

                            <div className="cart-page__summary-total">
                                <span>Total:</span>
                                <span className="cart-page__summary-total-value">${getTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <Button variant="primary" size="large" fullWidth onClick={() => navigate('/checkout')}>
                            Proceder al Pago
                        </Button>

                        <Button variant="outline" fullWidth onClick={() => navigate('/store')} style={{ marginTop: 'var(--spacing-3)' }}>
                            Continuar Comprando
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
