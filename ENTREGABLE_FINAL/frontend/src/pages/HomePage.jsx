import { useEffect } from 'react';
import SearchAutocomplete from '../components/SearchAutocomplete';
import ProductGrid from '../components/products/ProductGrid';
import FacetsPanel from '../components/FacetsPanel';
import useSearch from '../hooks/useSearch';
import '../styles/pages/home.css';

/**
 * HomePage - Página principal con búsqueda Elasticsearch
 * Integra búsqueda full-text, autocompletado y facets dinámicos
 */
function HomePage() {
    const {
        products,
        facets,
        suggestions,
        searchTerm,
        loading,
        error,
        selectedCategories,
        selectedPriceRange,
        minRating,
        handleSearch,
        handleAutocomplete,
        applyFilters,
        clearFilters,
        totalResults,
        hasActiveFilters
    } = useSearch();

    // Scroll to top al cargar
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                    <SearchAutocomplete
                        onSearch={handleSearch}
                        onAutocomplete={handleAutocomplete}
                        suggestions={suggestions}
                    />
                </div>
            </section>

            {/* Resultados */}
            <section className="home-page__results">
                <div className="home-page__results-header">
                    <h2 className="home-page__results-title">
                        {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los Productos'}
                    </h2>
                    <div className="home-page__results-info">
                        <p className="home-page__results-count">
                            {totalResults} {totalResults === 1 ? 'producto' : 'productos'}
                        </p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="clear-filters-btn">
                                ✕ Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                <div className="home-page__content">
                    {/* Panel de Facets */}
                    <FacetsPanel
                        facets={facets}
                        onApplyFilters={applyFilters}
                        currentFilters={{
                            categorias: selectedCategories,
                            ratingMin: minRating
                        }}
                    />

                    {/* Grid de productos */}
                    <div className="home-page__products">
                        {error && (
                            <div className="error-message">
                                <p>⚠️ {error}</p>
                                <button onClick={() => window.location.reload()}>
                                    Reintentar
                                </button>
                            </div>
                        )}

                        {!error && (
                            <ProductGrid products={products} loading={loading} />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
