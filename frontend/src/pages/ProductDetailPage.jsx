import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockProducts from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import '../styles/pages/product-detail.css';

/**
 * ProductDetailPage - Detalle de producto individual
 * Usa useParams para obtener el ID del producto
 * Usa useState para manejar la cantidad y la imagen seleccionada
 * Usa useEffect para cargar el producto y scroll top
 */
function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, isInCart } = useCart();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const found = mockProducts.find(p => p.id === id);
        if (found) {
            setProduct(found);
            setSelectedImage(0);
        } else {
            // Producto no encontrado, redirigir
            navigate('/store');
        }
    }, [id, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!product) {
        return (
            <div className="product-detail__loading">
                <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const handleQuantityChange = (delta) => {
        const newQty = quantity + delta;
        if (newQty >= 1) {
            setQuantity(newQty);
        }
    };

    return (
        <div className="product-detail">
            <Button
                variant="secondary"
                size="small"
                onClick={() => navigate(-1)}
                className="product-detail__back-button"
            >
                ← Volver
            </Button>

            <div className="product-detail__layout">
                {/* Galería de imágenes */}
                <div className="product-detail__gallery">
                    <div className="product-detail__main-image-container">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="product-detail__main-image"
                        />
                    </div>
                    {product.images.length > 1 && (
                        <div className="product-detail__thumbnails">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`product-detail__thumbnail ${selectedImage === index ? 'product-detail__thumbnail--active' : ''
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} ${index + 1}`}
                                        className="product-detail__thumbnail-image"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Información del producto */}
                <div className="product-detail__info">
                    <span className="product-detail__category">
                        {product.category}
                    </span>

                    <h1 className="product-detail__title">
                        {product.name}
                    </h1>

                    <p className="product-detail__manufacturer">
                        por <span className="product-detail__manufacturer-name">{product.manufacturer}</span>
                    </p>

                    <div className="product-detail__rating-container">
                        <div>
                            <span className="product-detail__stars">
                                {'⭐'.repeat(Math.floor(product.rating))}
                            </span>
                            <span className="product-detail__rating-text">
                                {' '}{product.rating} ({product.reviews} reviews)
                            </span>
                        </div>
                    </div>

                    <div className="product-detail__price">
                        ${product.price.toFixed(2)}
                    </div>

                    <p className="product-detail__description">
                        {product.longDescription}
                    </p>

                    {/* Especificaciones */}
                    <div className="product-detail__specs-container">
                        <h3 className="product-detail__specs-title">Especificaciones</h3>
                        <dl className="product-detail__specs-list">
                            <dt className="product-detail__spec-label">Formato</dt>
                            <dd className="product-detail__spec-value">{product.fileFormat}</dd>

                            <dt className="product-detail__spec-label">Polígonos</dt>
                            <dd className="product-detail__spec-value">{product.polygonCount.toLocaleString()}</dd>

                            <dt className="product-detail__spec-label">Tiempo estimado</dt>
                            <dd className="product-detail__spec-value">{product.printTime}</dd>

                            <dt className="product-detail__spec-label">Tamaño</dt>
                            <dd className="product-detail__spec-value">{product.fileSize}</dd>
                        </dl>
                    </div>

                    {/* Cantidad y agregar al carrito */}
                    <div className="product-detail__actions">
                        <div className="product-detail__quantity-selector">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                className="product-detail__quantity-btn"
                                aria-label="Disminuir cantidad"
                            >
                                −
                            </button>
                            <span className="product-detail__quantity-value">
                                {quantity}
                            </span>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                className="product-detail__quantity-btn"
                                aria-label="Aumentar cantidad"
                            >
                                +
                            </button>
                        </div>

                        <Button
                            variant={isInCart(product.id) ? "secondary" : "primary"}
                            size="large"
                            fullWidth
                            onClick={handleAddToCart}
                        >
                            {isInCart(product.id) ? '✓ Agregado al carrito' : '🛒 Agregar al carrito'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;

