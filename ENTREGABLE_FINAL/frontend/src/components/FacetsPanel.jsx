import { useState, useEffect } from 'react';
import './FacetsPanel.css';

/**
 * Panel de facets (filtros) dinámicos desde Elasticsearch
 * Muestra categorías, rangos de precios y ratings con contadores
 */
function FacetsPanel({ facets, onApplyFilters, currentFilters = {} }) {
    const [selectedCategories, setSelectedCategories] = useState(currentFilters.categorias || []);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [minRating, setMinRating] = useState(currentFilters.ratingMin || 0);

    // Sincronizar con filtros externos
    useEffect(() => {
        if (currentFilters.categorias) {
            setSelectedCategories(currentFilters.categorias);
        }
        if (currentFilters.ratingMin !== undefined) {
            setMinRating(currentFilters.ratingMin);
        }
    }, [currentFilters]);

    // Toggle categoría
    const handleCategoryToggle = (category) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];

        setSelectedCategories(newCategories);
    };

    // Seleccionar rango de precio
    const handlePriceRangeChange = (range) => {
        setSelectedPriceRange(range);
    };

    // Aplicar filtros
    const handleApply = () => {
        const filters = {
            categorias: selectedCategories.length > 0 ? selectedCategories : undefined,
            ratingMin: minRating > 0 ? minRating : undefined,
        };

        // Agregar rango de precio si está seleccionado
        if (selectedPriceRange) {
            // Parsear el rango (formato: "50-100" o "200+")
            const key = selectedPriceRange.range;
            if (key.includes('-')) {
                const [min, max] = key.split('-').map(Number);
                filters.precioMin = min;
                filters.precioMax = max;
            } else if (key.includes('+')) {
                filters.precioMin = parseInt(key);
                filters.precioMax = undefined;
            } else if (key.includes('0-')) {
                const max = parseInt(key.split('-')[1]);
                filters.precioMin = 0;
                filters.precioMax = max;
            }
        }

        onApplyFilters(filters);
    };

    // Limpiar filtros
    const handleClear = () => {
        setSelectedCategories([]);
        setSelectedPriceRange(null);
        setMinRating(0);
        onApplyFilters({});
    };

    // Si no hay facets, no mostrar nada
    if (!facets) {
        return (
            <aside className="facets-panel">
                <div className="facets-loading">
                    <p>Cargando filtros...</p>
                </div>
            </aside>
        );
    }

    const hasActiveFilters = selectedCategories.length > 0 ||
        selectedPriceRange !== null ||
        minRating > 0;

    return (
        <aside className="facets-panel">
            <div className="facets-header">
                <h3>Filtros</h3>
                {hasActiveFilters && (
                    <button onClick={handleClear} className="clear-all-btn">
                        Limpiar todo
                    </button>
                )}
            </div>

            {/* Categorías */}
            {facets.categories && facets.categories.length > 0 && (
                <div className="facet-group">
                    <h4>Categorías</h4>
                    <div className="facet-items">
                        {facets.categories.map((cat) => (
                            <label key={cat.name} className="facet-item">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(cat.name)}
                                    onChange={() => handleCategoryToggle(cat.name)}
                                />
                                <span className="facet-label">
                                    {cat.name}
                                    <span className="facet-count">({cat.count})</span>
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Rango de Precio */}
            {facets.priceRanges && facets.priceRanges.length > 0 && (
                <div className="facet-group">
                    <h4>Precio</h4>
                    <div className="facet-items">
                        {facets.priceRanges.map((range) => (
                            <label key={range.range} className="facet-item">
                                <input
                                    type="radio"
                                    name="precio"
                                    checked={selectedPriceRange?.range === range.range}
                                    onChange={() => handlePriceRangeChange(range)}
                                />
                                <span className="facet-label">
                                    ${range.range}
                                    <span className="facet-count">({range.count})</span>
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating Mínimo */}
            <div className="facet-group">
                <h4>Rating Mínimo</h4>
                <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="rating-select"
                >
                    <option value="0">Todos</option>
                    <option value="3">3+ ⭐</option>
                    <option value="4">4+ ⭐⭐</option>
                    <option value="5">5 ⭐⭐⭐</option>
                </select>
            </div>

            {/* Botón Aplicar */}
            <button onClick={handleApply} className="apply-filters-btn">
                Aplicar Filtros
            </button>
        </aside>
    );
}

export default FacetsPanel;
