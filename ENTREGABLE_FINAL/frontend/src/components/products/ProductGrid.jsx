import ProductCard from './ProductCard';
import '../../styles/components/product-grid.css';

/**
 * Componente ProductGrid - Grid de productos
 * @param {Object} props
 * @param {Array} props.products - Array de productos
 * @param {boolean} props.loading - Estado de carga
 */
function ProductGrid({ products, loading = false }) {
    if (loading) {
        return (
            <div className="product-grid product-grid--loading">
                <div className="spinner" style={{ margin: '0 auto' }}></div>
                <p className="product-grid__spinner-text">
                    Cargando productos...
                </p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="product-grid product-grid--empty">
                <div className="product-grid__empty-icon">🔍</div>
                <h2 className="product-grid__empty-title">No se encontraron productos</h2>
                <p className="product-grid__empty-text">
                    Intenta ajustar los filtros de búsqueda
                </p>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

export default ProductGrid;

