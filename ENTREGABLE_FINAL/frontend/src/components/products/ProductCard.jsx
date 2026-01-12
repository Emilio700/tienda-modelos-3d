import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Button from '../common/Button';
import './../../styles/components/product.css';

/**
 * Componente ProductCard - Tarjeta de producto
 * @param {Object} props
 * @param {Object} props.product - Datos del producto
 */
function ProductCard({ product }) {
    const { addToCart, isInCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        toggleWishlist(product);
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const stars = '⭐'.repeat(fullStars);
        return stars;
    };

    return (
        <article className="product-card">
            <Link to={`/product/${product.id}`}>
                <div className="product-card__image-wrapper">
                    {product.featured && (
                        <span className="product-card__badge">Destacado</span>
                    )}
                    <button
                        className="product-card__wishlist"
                        onClick={handleToggleWishlist}
                        aria-label={isInWishlist(product.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                        <span className={`product-card__wishlist-icon ${isInWishlist(product.id) ? 'product-card__wishlist-icon--active' : ''}`}>
                            {isInWishlist(product.id) ? '❤️' : '🤍'}
                        </span>
                    </button>
                    <img
                        src={product.images?.[1] || product.imagen || '/images/placeholder.jpg'}
                        alt={product.name || 'Producto'}
                        className="product-card__image"
                        loading="lazy"
                    />
                </div>
            </Link>

            <div className="product-card__content">
                <span className="product-card__category">{product.category || 'Categoría'}</span>

                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <h3 className="product-card__title">{product.name || 'Producto'}</h3>
                </Link>

                {product.manufacturer && (
                    <p className="product-card__manufacturer">
                        por {product.manufacturer}
                    </p>
                )}

                <p className="product-card__description">
                    {product.shortDescription || product.descripcion || ''}
                </p>

                <div className="product-card__rating">
                    <span className="product-card__stars">
                        {renderStars(product.rating || 0)}
                    </span>
                    <span>
                        {product.rating || 0} {product.reviews ? `(${product.reviews})` : ''}
                    </span>
                </div>

                <div className="product-card__footer">
                    <span className="product-card__price">
                        <span className="product-card__price-currency">$</span>
                        {(product.precio || product.price || 0).toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="product-card__actions">
                <Button
                    variant={isInCart(product.id) ? "secondary" : "primary"}
                    fullWidth
                    onClick={handleAddToCart}
                >
                    {isInCart(product.id) ? '✓ En carrito' : '🛒 Agregar'}
                </Button>
                <Link to={`/product/${product.id}`} style={{ flex: 1 }}>
                    <Button variant="outline" fullWidth>
                        Ver
                    </Button>
                </Link>
            </div>
        </article>
    );
}

export default ProductCard;
