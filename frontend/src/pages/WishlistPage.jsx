import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';

/**
 * WishlistPage - Página de lista de deseos
 * Muestra todos los productos marcados como favoritos
 */
function WishlistPage() {
    const navigate = useNavigate();
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart, isInCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product, 1);
    };

    const handleRemoveFromWishlist = (productId) => {
        removeFromWishlist(productId);
    };

    if (wishlist.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>🤍</div>
                <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Tu lista de deseos está vacía</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                    Explora nuestro catálogo y guarda tus modelos favoritos
                </p>
                <Button variant="primary" onClick={() => navigate('/store')}>
                    Explorar Productos
                </Button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--spacing-8) 0' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-6)'
            }}>
                <h1>❤️ Mi Lista de Deseos ({wishlist.length})</h1>
                <Button
                    variant="outline"
                    onClick={() => navigate('/store')}
                >
                    Continuar Comprando
                </Button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--spacing-6)'
            }}>
                {wishlist.map(product => (
                    <div
                        key={product.id}
                        style={{
                            background: 'var(--color-surface)',
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-md)',
                            transition: 'all var(--transition-base)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                    >
                        <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/product/${product.id}`)}
                            />
                            <button
                                onClick={() => handleRemoveFromWishlist(product.id)}
                                style={{
                                    position: 'absolute',
                                    top: 'var(--spacing-3)',
                                    right: 'var(--spacing-3)',
                                    width: '40px',
                                    height: '40px',
                                    border: 'none',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 'var(--radius-full)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 'var(--font-size-xl)',
                                    transition: 'all var(--transition-base)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                    e.currentTarget.style.background = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                                }}
                            >
                                ❌
                            </button>
                        </div>

                        <div style={{ padding: 'var(--spacing-4)' }}>
                            <span style={{
                                color: 'var(--color-primary-light)',
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 'var(--font-weight-medium)',
                                textTransform: 'uppercase'
                            }}>
                                {product.category}
                            </span>

                            <h3
                                style={{
                                    margin: 'var(--spacing-2) 0',
                                    fontSize: 'var(--font-size-lg)',
                                    fontWeight: 'var(--font-weight-bold)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                {product.name}
                            </h3>

                            <p style={{
                                color: 'var(--color-text-muted)',
                                fontSize: 'var(--font-size-sm)',
                                marginBottom: 'var(--spacing-3)'
                            }}>
                                por {product.manufacturer}
                            </p>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--spacing-4)'
                            }}>
                                <span style={{
                                    fontSize: 'var(--font-size-2xl)',
                                    fontWeight: 'var(--font-weight-bold)',
                                    color: 'var(--color-primary-light)'
                                }}>
                                    ${product.price.toFixed(2)}
                                </span>
                                <span style={{ color: 'var(--color-warning)' }}>
                                    {'⭐'.repeat(Math.floor(product.rating))} {product.rating}
                                </span>
                            </div>

                            <Button
                                variant={isInCart(product.id) ? "secondary" : "primary"}
                                fullWidth
                                onClick={() => handleAddToCart(product)}
                            >
                                {isInCart(product.id) ? '✓ En carrito' : '🛒 Agregar al carrito'}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WishlistPage;
