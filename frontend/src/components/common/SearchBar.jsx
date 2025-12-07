import { useState } from 'react';
import './../../styles/components/search.css';

/**
 * Componente SearchBar para búsqueda de productos
 * @param {Object} props
 * @param {string} props.value - Valor actual del input
 * @param {Function} props.onChange - Función para manejar cambios
 * @param {string} props.placeholder - Texto placeholder
 */
function SearchBar({ value, onChange, placeholder = 'Buscar modelos 3D...' }) {
    const handleClear = () => {
        onChange('');
    };

    return (
        <div className="search-bar">
            <div className="search-bar__wrapper">
                <span className="search-bar__icon">🔍</span>
                <input
                    type="text"
                    className="search-bar__input"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {value && (
                    <button
                        type="button"
                        className="search-bar__clear"
                        onClick={handleClear}
                        aria-label="Limpiar búsqueda"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
