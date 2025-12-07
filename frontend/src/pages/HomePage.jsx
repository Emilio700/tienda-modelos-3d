import { useState, useEffect } from 'react';
import SearchBar from '../components/common/SearchBar';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import mockProducts from '../data/mockProducts';
import useSearch from '../hooks/useSearch';
import '../styles/pages/home.css';

/**
 * HomePage - Página principal con catálogo de productos
 * Utiliza useSearch custom hook para filtrar productos
 * Utiliza useState para controlar el término de búsqueda usado en SearchBar
 * Utiliza useEffect para scroll to top al cargar
 */
function HomePage() {
    const {
        searchTerm,
        setSearchTerm,
        selectedCategories,
        selectedManufacturers,
        setSortBy,
        sortBy,
        toggleCategory,
        toggleManufacturer,
        setPriceRange,
        clearFilters,
        filteredProducts,
        availableCategories,
        availableManufacturers,
        priceRangeLimits,
        totalResults
    } = useSearch(mockProducts);

    const [loading, setLoading] = useState(true);

    // Simular carga inicial
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Scroll to top al cargar
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePriceChange = (min, max) => {
        setPriceRange({ min, max });
    };

    return (
        <div className="container home-page">
            {/* Hero Section */}
            <section className="home-page__hero">
                <h1 className="home-page__title">
                    Modelos 3D de Alta Calidad
                </h1>
                <p className="home-page__subtitle">
                    Descubre miles de diseños únicos para impresión 3D. Desde miniaturas hasta arquitectura.
                </p>
                <div className="home-page__search">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar modelos 3D..."
                    />
                </div>
            </section>

            {/* Resultados */}
            <section className="home-page__results">
                <div className="home-page__results-header">
                    <h2 className="home-page__results-title">
                        {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los Productos'}
                    </h2>
                    <p className="home-page__results-count">
                        {totalResults} {totalResults === 1 ? 'producto' : 'productos'}
                    </p>
                </div>

                <div className="home-page__content">
                    {/* Filtros */}
                    <ProductFilters
                        categories={availableCategories}
                        manufacturers={availableManufacturers}
                        priceRange={priceRangeLimits}
                        selectedCategories={selectedCategories}
                        selectedManufacturers={selectedManufacturers}
                        onToggleCategory={toggleCategory}
                        onToggleManufacturer={toggleManufacturer}
                        onPriceChange={handlePriceChange}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        onClearFilters={clearFilters}
                    />

                    {/* Grid de productos */}
                    <ProductGrid products={filteredProducts} loading={loading} />
                </div>
            </section>
        </div>
    );
}

export default HomePage;

