import express from 'express';
import { Client } from '@elastic/elasticsearch';

const router = express.Router();

// Inicializar cliente de Elasticsearch
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

// GET /api/productos - Listado de productos con paginación
router.get('/productos', async (req, res) => {
  try {
    const { page = 1, size = 12 } = req.query;
    
    const result = await esClient.search({
      index: 'productos',
      from: (page - 1) * size,
      size: parseInt(size),
      body: {
        query: { match_all: {} },
        sort: [{ _score: 'desc' }]
      }
    });
    
    res.json({
      products: result.hits.hits.map(hit => ({ ...hit._source, id: hit._id })),
      total: result.hits.total.value,
      page: parseInt(page),
      totalPages: Math.ceil(result.hits.total.value / size)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /api/productos/:id - Detalle de un producto
router.get('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await esClient.get({
      index: 'productos',
      id: id
    });
    
    res.json({ ...result._source, id: result._id });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// GET /api/search?q=query - Búsqueda full-text
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }
    
    const result = await esClient.search({
      index: 'productos',
      body: {
        query: {
          multi_match: {
            query: q,
            fields: ['nombre^3', 'descripcion', 'categoria'],
            fuzziness: 'AUTO',
            operator: 'or'
          }
        },
        highlight: {
          fields: {
            nombre: {},
            descripcion: {}
          }
        }
      }
    });
    
    res.json(result.hits.hits.map(hit => ({ 
      ...hit._source, 
      id: hit._id,
      _score: hit._score,
      highlight: hit.highlight
    })));
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});

// GET /api/search/autocomplete?prefix=text - Autocompletado
router.get('/search/autocomplete', async (req, res) => {
  try {
    const { prefix } = req.query;
    
    if (!prefix || prefix.length < 2) {
      return res.json([]);
    }
    
    const result = await esClient.search({
      index: 'productos',
      body: {
        query: {
          match: {
            'nombre.search_as_you_type': {
              query: prefix,
              operator: 'and'
            }
          }
        },
        _source: ['nombre', 'id', 'categoria'],
        size: 5
      }
    });
    
    res.json(result.hits.hits.map(hit => ({
      id: hit._id,
      nombre: hit._source.nombre,
      categoria: hit._source.categoria
    })));
  } catch (error) {
    console.error('Error autocomplete:', error);
    res.status(500).json({ error: 'Error en autocompletado' });
  }
});

// GET /api/search/facets - Agregaciones para filtros
router.get('/search/facets', async (req, res) => {
  try {
    const result = await esClient.search({
      index: 'productos',
      body: {
        size: 0,
        aggs: {
          categorias: {
            terms: { 
              field: 'categoria.keyword', 
              size: 20,
              order: { _count: 'desc' }
            }
          },
          precio_ranges: {
            range: {
              field: 'precio',
              ranges: [
                { key: '0-50', to: 50 },
                { key: '50-100', from: 50, to: 100 },
                { key: '100-200', from: 100, to: 200 },
                { key: '200+', from: 200 }
              ]
            }
          },
          ratings: {
            terms: { 
              field: 'rating',
              order: { _key: 'desc' }
            }
          }
        }
      }
    });
    
    res.json({
      categorias: result.aggregations.categorias.buckets,
      precios: result.aggregations.precio_ranges.buckets,
      ratings: result.aggregations.ratings.buckets
    });
  } catch (error) {
    console.error('Error fetching facets:', error);
    res.status(500).json({ error: 'Error al obtener facets' });
  }
});

// POST /api/search/filter - Búsqueda con filtros (facets)
router.post('/search/filter', async (req, res) => {
  try {
    const { query, categorias, precioMin, precioMax, ratingMin } = req.body;
    
    const must = [];
    const filter = [];
    
    // Búsqueda de texto
    if (query && query.trim() !== '') {
      must.push({
        multi_match: {
          query,
          fields: ['nombre^3', 'descripcion', 'categoria']
        }
      });
    }
    
    // Filtro de categorías
    if (categorias && categorias.length > 0) {
      filter.push({
        terms: { 'categoria.keyword': categorias }
      });
    }
    
    // Filtro de precio
    if (precioMin !== undefined || precioMax !== undefined) {
      const rangeQuery = { range: { precio: {} } };
      if (precioMin !== undefined) rangeQuery.range.precio.gte = precioMin;
      if (precioMax !== undefined) rangeQuery.range.precio.lte = precioMax;
      filter.push(rangeQuery);
    }
    
    // Filtro de rating
    if (ratingMin !== undefined) {
      filter.push({
        range: { rating: { gte: ratingMin } }
      });
    }
    
    const result = await esClient.search({
      index: 'productos',
      body: {
        query: {
          bool: { 
            must: must.length > 0 ? must : [{ match_all: {} }], 
            filter 
          }
        }
      }
    });
    
    res.json(result.hits.hits.map(hit => ({ 
      ...hit._source, 
      id: hit._id 
    })));
  } catch (error) {
    console.error('Error filtering products:', error);
    res.status(500).json({ error: 'Error al filtrar productos' });
  }
});

export default router;
