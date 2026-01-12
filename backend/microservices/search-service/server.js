import express from 'express';
import cors from 'cors';
import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.SEARCH_SERVICE_PORT || 3001;

// Elasticsearch client
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

// Middleware
// CORS disabled - handled by API Gateway
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'search-service',
    elasticsearch: esClient.ping().then(() => 'connected').catch(() => 'disconnected')
  });
});

// GET /productos - Listar todos los productos
app.get('/productos', async (req, res) => {
  try {
    const result = await esClient.search({
      index: 'productos',
      body: {
        query: { match_all: {} },
        size: 100
      }
    });

    const products = result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    }));

    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /productos/:id - Detalle de producto
app.get('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await esClient.get({
      index: 'productos',
      id: id
    });

    res.json({
      id: result._id,
      ...result._source
    });
  } catch (error) {
    if (error.meta?.statusCode === 404) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// GET /search?q=term - Búsqueda full-text
app.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const from = (parseInt(page) - 1) * parseInt(limit);

    const result = await esClient.search({
      index: 'productos',
      from,
      size: parseInt(limit),
      body: {
        query: {
          multi_match: {
            query: q,
            fields: ['name^3', 'shortDescription', 'category', 'manufacturer'],
            fuzziness: 'AUTO',
            operator: 'or'
          }
        },
        highlight: {
          fields: {
            name: {},
            shortDescription: {}
          }
        }
      }
    });

    res.json(result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source,
      score: hit._score,
      highlight: hit.highlight
    })));
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Error en búsqueda' });
  }
});

// GET /search/autocomplete?prefix=text - Autocompletado
app.get('/search/autocomplete', async (req, res) => {
  try {
    const { prefix } = req.query;
    
    if (!prefix || prefix.length < 2) {
      return res.json([]);
    }
    
    const result = await esClient.search({
      index: 'productos',
      body: {
        query: {
          multi_match: {
            query: prefix,
            fields: ['name^2', 'category'],
            type: 'bool_prefix',
            fuzziness: 'AUTO'
          }
        },
        _source: ['name', 'id', 'category'],
        size: 5
      }
    });
    
    res.json(result.hits.hits.map(hit => ({
      id: hit._id,
      nombre: hit._source.name,
      categoria: hit._source.category
    })));
  } catch (error) {
    console.error('Error autocomplete:', error);
    res.status(500).json({ error: 'Error en autocompletado' });
  }
});

// GET /search/facets - Obtener facets/filtros
app.get('/search/facets', async (req, res) => {
  try {
    const result = await esClient.search({
      index: 'productos',
      body: {
        size: 0,
        aggs: {
          categorias: {
            terms: {
              field: 'category.keyword',
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
          rating_stats: {
            stats: { field: 'rating' }
          }
        }
      }
    });

    res.json({
      categories: result.aggregations.categorias.buckets.map(b => ({
        name: b.key,
        count: b.doc_count
      })),
      priceRanges: result.aggregations.precio_ranges.buckets.map(b => ({
        range: b.key,
        count: b.doc_count
      })),
      ratingStats: result.aggregations.rating_stats
    });
  } catch (error) {
    console.error('Error fetching facets:', error);
    res.status(500).json({ error: 'Error al obtener facets' });
  }
});

// POST /search/filter - Búsqueda con filtros
app.post('/search/filter', async (req, res) => {
  try {
    const { query = '', categorias = [], precioMin, precioMax, ratingMin } = req.body;

    const must = [];
    const filter = [];

    // Query text
    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['name^3', 'shortDescription', 'category', 'manufacturer'],
          fuzziness: 'AUTO'
        }
      });
    }

    // Filtro categorías
    if (categorias.length > 0) {
      filter.push({
        terms: { 'category.keyword': categorias }
      });
    }

    // Filtro precio
    if (precioMin !== undefined || precioMax !== undefined) {
      const rangeQuery = { precio: {} };
      if (precioMin !== undefined) rangeQuery.precio.gte = precioMin;
      if (precioMax !== undefined) rangeQuery.precio.lte = precioMax;
      filter.push({ range: rangeQuery });
    }

    // Filtro rating
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
        },
        size: 50
      }
    });

    res.json(result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    })));
  } catch (error) {
    console.error('Error filtering:', error);
    res.status(500).json({ error: 'Error en filtrado' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🔍 Search Service running on port ${PORT}`);
  console.log(`📡 Elasticsearch: ${process.env.ELASTICSEARCH_URL || 'http://localhost:9200'}`);
});
