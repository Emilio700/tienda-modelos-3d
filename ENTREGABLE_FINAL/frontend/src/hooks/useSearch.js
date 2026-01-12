import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';

/**
 * Custom hook para búsqueda con Elasticsearch
 * Maneja búsqueda full-text, autocompletado, filtros y facets
 */
function useSearch() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [facets, setFacets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [minRating, setMinRating] = useState(0);

  // Cargar productos iniciales y facets al montar
  useEffect(() => {
    fetchProducts();
    fetchFacets();
  }, []);

  // Cargar todos los productos (inicial)
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/productos`);
      if (!response.ok) throw new Error('Error al cargar productos');
      
      const data = await response.json();
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener facets (agregaciones)
  const fetchFacets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/search/facets`);
      if (!response.ok) throw new Error('Error al cargar facets');
      
      const data = await response.json();
      console.log('✅ Facets recibidos:', data); // DEBUG
      setFacets(data);
    } catch (err) {
      console.error('❌ Error fetching facets:', err);
    }
  };

  // Búsqueda full-text con Elasticsearch
  const handleSearch = useCallback(async (term) => {
    setSearchTerm(term);
    
    // Si no hay término, recargar todos los productos
    if (!term || term.trim() === '') {
      fetchProducts();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search?q=${encodeURIComponent(term)}`
      );
      if (!response.ok) throw new Error('Error en la búsqueda');
      
      const data = await response.json();
      setFilteredProducts(data);
    } catch (err) {
      console.error('Error searching:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Autocompletado con search-as-you-type
  const handleAutocomplete = useCallback(async (prefix) => {
    if (!prefix || prefix.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search/autocomplete?prefix=${encodeURIComponent(prefix)}`
      );
      if (!response.ok) throw new Error('Error en autocompletado');
      
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Error autocomplete:', err);
      setSuggestions([]);
    }
  }, []);

  // Aplicar filtros con facets
  const applyFilters = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    // Construir objeto de filtros
    const filterPayload = {
      query: searchTerm || undefined,
      categorias: filters.categorias || selectedCategories,
      precioMin: filters.precioMin,
      precioMax: filters.precioMax,
      ratingMin: filters.ratingMin !== undefined ? filters.ratingMin : minRating
    };

    // Actualizar estados locales si se pasaron valores
    if (filters.categorias !== undefined) setSelectedCategories(filters.categorias);
    if (filters.ratingMin !== undefined) setMinRating(filters.ratingMin);
    if (filters.precioMin !== undefined || filters.precioMax !== undefined) {
      setSelectedPriceRange({
        min: filters.precioMin,
        max: filters.precioMax
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/search/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterPayload)
      });
      
      if (!response.ok) throw new Error('Error al filtrar productos');
      
      const data = await response.json();
      setFilteredProducts(data);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategories, minRating]);

  // Limpiar filtros
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setMinRating(0);
    setSearchTerm('');
    fetchProducts();
    fetchFacets();
  };

  // Toggle categoría
  const toggleCategory = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    applyFilters({ categorias: newCategories });
  };

  return {
    // Datos
    products: filteredProducts,
    allProducts: products,
    facets,
    suggestions,
    
    // Estado de búsqueda
    searchTerm,
    loading,
    error,
    
    // Estado de filtros
    selectedCategories,
    selectedPriceRange,
    minRating,
    
    // Funciones de búsqueda
    handleSearch,
    handleAutocomplete,
    setSearchTerm,
    
    // Funciones de filtrado
    applyFilters,
    clearFilters,
    toggleCategory,
    setSelectedCategories,
    setSelectedPriceRange,
    setMinRating,
    
    // Estadísticas
    totalResults: filteredProducts.length,
    hasActiveFilters: selectedCategories.length > 0 || 
                      selectedPriceRange !== null || 
                      minRating > 0 ||
                      (searchTerm && searchTerm.trim() !== '')
  };
}

export default useSearch;
