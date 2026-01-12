import { useState, useRef, useEffect } from 'react';
import './SearchAutocomplete.css';

/**
 * Componente de búsqueda con autocompletado
 * Utiliza Elasticsearch search-as-you-type para sugerencias en tiempo real
 */
function SearchAutocomplete({ onSearch, onAutocomplete, suggestions = [] }) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Manejar cambio en input
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Activar autocompletado solo con 2+ caracteres
        if (value.length >= 2) {
            onAutocomplete(value);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    // Seleccionar sugerencia
    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion.nombre);
        setShowSuggestions(false);
        onSearch(suggestion.nombre);
    };

    // Submit del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        onSearch(inputValue);
    };

    // Limpiar búsqueda
    const handleClear = () => {
        setInputValue('');
        setShowSuggestions(false);
        onSearch('');
    };

    return (
        <div className="search-autocomplete" ref={wrapperRef}>
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Buscar modelos 3D (ej: dragón, nave espacial)..."
                        className="search-input"
                        autoComplete="off"
                    />
                    {inputValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="clear-btn"
                            aria-label="Limpiar búsqueda"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <button type="submit" className="search-btn">
                    Buscar
                </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-dropdown">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="suggestion-item"
                        >
                            <span className="suggestion-icon">📦</span>
                            <div className="suggestion-content">
                                <span className="suggestion-name">{suggestion.nombre}</span>
                                <span className="suggestion-category">{suggestion.categoria}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchAutocomplete;
