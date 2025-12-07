import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook para buscar y filtrar productos
 * Maneja búsqueda por texto, filtros por categoría/fabricante/precio y ordenamiento
 */
function useSearch(products) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sortBy, setSortBy] = useState('name-asc'); // name-asc, name-desc, price-asc, price-desc, rating

  // Resetear filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedManufacturers([]);
    setPriceRange({ min: 0, max: Infinity });
    setSortBy('name-asc');
  };

  // Toggle categoría
  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Toggle fabricante
  const toggleManufacturer = (manufacturer) => {
    setSelectedManufacturers(prev =>
      prev.includes(manufacturer)
        ? prev.filter(m => m !== manufacturer)
        : [...prev, manufacturer]
    );
  };

  // Productos filtrados y ordenados (useMemo para optimización)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(lowerSearchTerm) ||
        product.shortDescription.toLowerCase().includes(lowerSearchTerm) ||
        product.longDescription.toLowerCase().includes(lowerSearchTerm) ||
        product.manufacturer.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Filtrar por categorías
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Filtrar por fabricantes
    if (selectedManufacturers.length > 0) {
      filtered = filtered.filter(product =>
        selectedManufacturers.includes(product.manufacturer)
      );
    }

    // Filtrar por rango de precio
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategories, selectedManufacturers, priceRange, sortBy]);

  // Obtener categorías únicas (useMemo para optimización)
  const availableCategories = useMemo(() => {
    return [...new Set(products.map(p => p.category))].sort();
  }, [products]);

  // Obtener fabricantes únicos (useMemo para optimización)
  const availableManufacturers = useMemo(() => {
    return [...new Set(products.map(p => p.manufacturer))].sort();
  }, [products]);

  // Obtener rango de precios
  const priceRangeLimits = useMemo(() => {
    const prices = products.map(p => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  return {
    // Estado
    searchTerm,
    selectedCategories,
    selectedManufacturers,
    priceRange,
    sortBy,
    
    // Setters
    setSearchTerm,
    setSelectedCategories,
    setSelectedManufacturers,
    setPriceRange,
    setSortBy,
    
    // Helpers
    toggleCategory,
    toggleManufacturer,
    clearFilters,
    
    // Resultados
    filteredProducts,
    availableCategories,
    availableManufacturers,
    priceRangeLimits,
    
    // Estadísticas
    totalResults: filteredProducts.length,
    hasActiveFilters: searchTerm || selectedCategories.length > 0 || 
                      selectedManufacturers.length > 0 || 
                      priceRange.min > 0 || priceRange.max < Infinity
  };
}

export default useSearch;
