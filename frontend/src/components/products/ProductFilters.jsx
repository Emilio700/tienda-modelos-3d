import { useState } from 'react';
import './../../styles/components/filters.css';

/**
 * Componente ProductFilters - Filtros de productos
 * @param {Object} props
 * @param {Function} props.onFilterChange - Callback cuando cambian los filtros
 * @param {Array} props.categories - Array de categorías disponibles
 * @param {Array} props.manufacturers - Array de fabricantes disponibles
 * @param {Object} props.priceRange - Rango de precios {min, max}
 * @param {Array} props.selectedCategories - Categorías seleccionadas
 * @param {Array} props.selectedManufacturers - Fabricantes seleccionados
 * @param {Function} props.onToggleCategory - Toggle categoría
 * @param {Function} props.onToggleManufacturer - Toggle fabricante
 * @param {Function} props.onPriceChange - Cambio de precio
 * @param {string} props.sortBy - Ordenamiento actual
 * @param {Function} props.onSortChange - Cambio de ordenamiento
 * @param {Function} props.onClearFilters - Limpiar filtros
 */
function ProductFilters({
    categories,
    manufacturers,
    priceRange,
    selectedCategories,
    selectedManufacturers,
    onToggleCategory,
    onToggleManufacturer,
    onPriceChange,
    sortBy,
    onSortChange,
    onClearFilters
}) {
    const [localPriceMin, setLocalPriceMin] = useState(0);
    const [localPriceMax, setLocalPriceMax] = useState(Infinity);
    const [isOpen, setIsOpen] = useState(false);

    const handlePriceChange = () => {
        onPriceChange(localPriceMin, localPriceMax);
    };

    const toggleFilters = () => {
        setIsOpen(!isOpen);
    };

    return (
        <aside className="filters">
            {/* Toggle button (solo visible en tablet/mobile) */}
            <button className="filters__toggle" onClick={toggleFilters}>
                <span>🔍 Filtros y Ordenamiento</span>
                <span className={`filters__toggle-icon ${isOpen ? 'filters__toggle-icon--open' : ''}`}>
                    ▼
                </span>
            </button>

            {/* Contenido de filtros */}
            <div className={`filters__content ${isOpen ? 'filters__content--expanded' : 'filters__content--collapsed'}`}>
                <div className="filters__header">
                    <h2 className="filters__title">Filtros</h2>
                    <button className="filters__clear" onClick={onClearFilters}>
                        Limpiar todo
                    </button>
                </div>

                {/* Ordenar por */}
                <div className="filters__section">
                    <h3 className="filters__section-title">Ordenar por</h3>
                    <select
                        className="filters__select"
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        <option value="name-asc">Nombre (A-Z)</option>
                        <option value="name-desc">Nombre (Z-A)</option>
                        <option value="price-asc">Precio (Menor a Mayor)</option>
                        <option value="price-desc">Precio (Mayor a Menor)</option>
                        <option value="rating">Mejor Valorados</option>
                    </select>
                </div>

                {/* Categorías */}
                <div className="filters__section">
                    <h3 className="filters__section-title">Categorías</h3>
                    {categories.map((category) => (
                        <label key={category} className="filters__option">
                            <input
                                type="checkbox"
                                className="filters__checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => onToggleCategory(category)}
                            />
                            <span className="filters__label">{category}</span>
                        </label>
                    ))}
                </div>

                {/* Fabricantes */}
                <div className="filters__section">
                    <h3 className="filters__section-title">Fabricantes</h3>
                    {manufacturers.map((manufacturer) => (
                        <label key={manufacturer} className="filters__option">
                            <input
                                type="checkbox"
                                className="filters__checkbox"
                                checked={selectedManufacturers.includes(manufacturer)}
                                onChange={() => onToggleManufacturer(manufacturer)}
                            />
                            <span className="filters__label">{manufacturer}</span>
                        </label>
                    ))}
                </div>

                {/* Rango de precio */}
                <div className="filters__section">
                    <h3 className="filters__section-title">Rango de Precio</h3>
                    <div className="filters__range">
                        <div className="filters__range-inputs">
                            <input
                                type="number"
                                className="filters__range-input"
                                placeholder="Min"
                                value={localPriceMin === 0 ? '' : localPriceMin}
                                onChange={(e) => setLocalPriceMin(Number(e.target.value) || 0)}
                                onBlur={handlePriceChange}
                                min={priceRange.min}
                                max={priceRange.max}
                            />
                            <span className="filters__range-separator">-</span>
                            <input
                                type="number"
                                className="filters__range-input"
                                placeholder="Max"
                                value={localPriceMax === Infinity ? '' : localPriceMax}
                                onChange={(e) => setLocalPriceMax(Number(e.target.value) || Infinity)}
                                onBlur={handlePriceChange}
                                min={priceRange.min}
                                max={priceRange.max}
                            />
                        </div>
                        <small style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                            Rango disponible: ${priceRange.min} - ${priceRange.max}
                        </small>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default ProductFilters;

