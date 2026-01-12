import { Client } from '@elastic/elasticsearch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cliente de Elasticsearch
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

// Productos mock (compatible con ProductCard)
const mockProducts = [
  {
    id: '1',
    name: 'Mini Dragón Articulado',
    manufacturer: 'MakerBot Models',
    category: 'Fantasía',
    shortDescription: 'Modelo de dragón articulado imprimible en 3D',
    precio: 45.99,
    imagen: '/src/assets/products/minidragon2.jpg',
    images: ['/src/assets/products/minidragon2.jpg', '/src/assets/products/minidragon3.jpg'],
    rating: 5,
    reviews: 89,
    disponible: true,
    tags: ['dragón', 'articulado', 'fantasía', 'coleccionable']
  },
  {
    id: '2',
    name: 'Nave Espacial Futurista',
    manufacturer: 'TechDesign Studio',
    category: 'Ciencia Ficción',
    shortDescription: 'Diseño detallado de nave espacial de ciencia ficción',
    precio: 89.99,
    imagen: '/src/assets/products/spaceship_stl_1764920953123.png',
    images: ['/src/assets/products/spaceship_stl_1764920953123.png', '/src/assets/products/spaceship_stl_2.png'],
    rating: 4,
    reviews: 156,
    disponible: true,
    tags: ['nave', 'espacial', 'sci-fi', 'LED']
  },
  {
    id: '3',
    name: 'Catedral Gótica Miniatura',
    manufacturer: 'Creative Crafts',
    category: 'Arquitectura',
    shortDescription: 'Réplica arquitectónica de catedral gótica con detalles intrincados',
    precio: 129.99,
    imagen: '/src/assets/products/cathedral_stl_1764920966827.png',
    images: ['/src/assets/products/cathedral_stl_1764920966827.png', '/src/assets/products/cathedral_stl_2.png'],
    rating: 5,
    reviews: 234,
    disponible: true,
    tags: ['catedral', 'gótico', 'arquitectura', 'medieval']
  },
  {
    id: '4',
    name: 'Set de Engranajes Funcionales',
    manufacturer: 'EduTech Models',
    category: 'Educativo',
    shortDescription: 'Colección de 12 engranajes funcionales de diferentes tamaños',
    precio: 34.99,
    imagen: '/src/assets/products/gears_set_stl_1764920981853.png',
    images: ['/src/assets/products/gears_set_stl_1764920981853.png', '/src/assets/products/gears_set_stl_2png.png'],
    rating: 4,
    reviews: 178,
    disponible: true,
    tags: ['engranajes', 'mecánica', 'educativo', 'funcional']
  },
  {
    id: '5',
    name: 'Colección de Jarrones Decorativos',
    manufacturer: 'Home Design Studio',
    category: 'Decoración',
    shortDescription: 'Pack de 5 diseños únicos de jarrones con patrones geométricos',
    precio: 24.99,
    imagen: '/src/assets/products/vase_collection_stl_1764921003743.png',
    images: ['/src/assets/products/vase_collection_stl_1764921003743.png', '/src/assets/products/vase_collection_stl_2.png'],
    rating: 5,
    reviews: 92,
    disponible: false,
    tags: ['jarrón', 'decoración', 'geométrico', 'hogar']
  },
  {
    id: '6',
    name: 'Ajedrez Temático Medieval',
    manufacturer: 'Chess Masters',
    category: 'Juegos',
    shortDescription: 'Set completo de ajedrez (32 piezas) con temática medieval',
    precio: 159.99,
    imagen: '/src/assets/products/chess_set_stl_1764921019139.png',
    images: ['/src/assets/products/chess_set_stl_1764921019139.png', '/src/assets/products/chess_set_stl_2.png'],
    rating: 5,
    reviews: 267,
    disponible: true,
    tags: ['ajedrez', 'medieval', 'juego', 'tablero']
  },
  {
    id: '7',
    name: 'Pack de Robots Articulados',
    manufacturer: 'RoboDesign',
    category: 'Robótica',
    shortDescription: 'Colección de 3 robots con articulaciones móviles',
    precio: 54.99,
    imagen: '/src/assets/products/robot_pack_stl_1764921033384.png',
    images: ['/src/assets/products/robot_pack_stl_1764921033384.png', '/src/assets/products/robot_pack_stl_2.png'],
    rating: 4,
    reviews: 145,
    disponible: true,
    tags: ['robot', 'articulado', 'futurista', 'colección']
  },
  {
    id: '8',
    name: 'Auto Clásico Vintage',
    manufacturer: 'Classic Models',
    category: 'Vehículos',
    shortDescription: 'Réplica detallada de automóvil clásico de los años 50',
    precio: 79.99,
    imagen: '/src/assets/products/vintage_car_stl_1764921046131.png',
    images: ['/src/assets/products/vintage_car_stl_1764921046131.png', '/src/assets/products/car2.jpg'],
    rating: 5,
    reviews: 198,
    disponible: true,
    tags: ['auto', 'vintage', 'clásico', 'coleccionable']
  },
  {
    id: '9',
    name: 'Ciudad Modular Sci-Fi',
    manufacturer: 'TechDesign Studio',
    category: 'Ciencia Ficción',
    shortDescription: 'Sistema modular de edificios futuristas',
    precio: 199.99,
    imagen: '/src/assets/products/modular_city_stl_1764921060088.png',
    images: ['/src/assets/products/modular_city_stl_1764921060088.png', '/src/assets/products/modular_city_stl_2.png'],
    rating: 5,
    reviews: 312,
    disponible: true,
    tags: ['ciudad', 'modular', 'sci-fi', 'wargame']
  },
  {
    id: '10',
    name: 'Dragón Grande Articulado',
    manufacturer: 'MakerBot Models',
    category: 'Fantasía',
    shortDescription: 'Impresionante dragón articulado de 30cm',
    precio: 99.99,
    imagen: '/src/assets/products/dragonarticulado1.jpg',
    images: ['/src/assets/products/dragonarticulado1.jpg', '/src/assets/products/dragonarticulado2.jpg'],
    rating: 5,
    reviews: 421,
    disponible: true,
    tags: ['dragón', 'grande', 'articulado', 'desafiante']
  },
  {
    id: '11',
    name: 'Organizador de Herramientas',
    manufacturer: 'WorkShop Tools',
    category: 'Utilidades',
    shortDescription: 'Sistema modular de organización para taller',
    precio: 39.99,
    imagen: '/src/assets/products/tool_organizer_stl_1764921099588.png',
    images: ['/src/assets/products/tool_organizer_stl_1764921099588.png', '/src/assets/products/tool_organizer_stl_2.png'],
    rating: 4,
    reviews: 167,
    disponible: true,
    tags: ['organizador', 'herramientas', 'funcional', 'modular']
  },
  {
    id: '12',
    name: 'Terreno Fantástico para Miniaturas',
    manufacturer: 'Tabletop Terrain',
    category: 'Juegos',
    shortDescription: 'Set de 10 piezas de terreno variado',
    precio: 74.99,
    imagen: '/src/assets/products/fantasy_terrain_stl_1764921116651.png',
    images: ['/src/assets/products/fantasy_terrain_stl_1764921116651.png', '/src/assets/products/fantasy_terrain_stl_2.png'],
    rating: 5,
    reviews: 289,
    disponible: true,
    tags: ['terreno', 'miniaturas', 'D&D', 'wargame']
  },
  {
    id: '13',
    name: 'Arte de Pared Geométrico',
    manufacturer: 'Home Design Studio',
    category: 'Decoración',
    shortDescription: 'Colección de 6 paneles decorativos con diseños geométricos 3D',
    precio: 44.99,
    imagen: '/src/assets/products/wall_art_stl_1764921133006.png',
    images: ['/src/assets/products/wall_art_stl_1764921133006.png', '/src/assets/products/wall_art_stl_2.png'],
    rating: 4,
    reviews: 124,
    disponible: true,
    tags: ['arte', 'pared', 'geométrico', 'decoración']
  },
  {
    id: '14',
    name: 'Módulo Lunar',
    manufacturer: 'Space Models',
    category: 'Histórico',
    shortDescription: 'Réplica histórica del módulo de alunizaje Apollo',
    precio: 109.99,
    imagen: '/src/assets/products/lunar_lander_stl_1764921148192.png',
    images: ['/src/assets/products/lunar_lander_stl_1764921148192.png', '/src/assets/products/NAVE2.jpg'],
    rating: 5,
    reviews: 345,
    disponible: false,
    tags: ['lunar', 'NASA', 'histórico', 'educativo']
  },
  {
    id: '15',
    name: 'Templo Oriental Miniatura',
    manufacturer: 'Creative Crafts',
    category: 'Arquitectura', 
    shortDescription: 'Templo asiático con arquitectura tradicional',
    precio: 94.99,
    imagen: '/src/assets/products/phone_stands_stl_1764921164288.png',
    images: ['/src/assets/products/phone_stands_stl_1764921164288.png', '/src/assets/products/phone_stands_stl_2.png'],
    rating: 4,
    reviews: 201,
    disponible: true,
    tags: ['templo', 'oriental', 'arquitectura', 'miniatura']
  }
];

async function seedElasticsearch() {
  try {
    console.log('🔍 Verificando conexión con Elasticsearch...');
    
    // Verificar conexión
    const health = await esClient.cluster.health();
    console.log(`✅ Elasticsearch conectado: ${health.status}`);
    
    // Eliminar índice si existe (para re-seed limpio)
    const indexExists = await esClient.indices.exists({ index: 'productos' });
    if (indexExists) {
      console.log('🗑️  Eliminando índice existente...');
      await esClient.indices.delete({ index: 'productos' });
    }
    
    console.log('📝 Creando índice con mapping...');
    
    // Crear índice con mapping optimizado
    await esClient.indices.create({
      index: 'productos',
      body: {
        settings: {
          analysis: {
            analyzer: {
              spanish_custom: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'asciifolding', 'spanish_stop', 'spanish_stemmer']
              }
            },
            filter: {
              spanish_stop: {
                type: 'stop',
                stopwords: '_spanish_'
              },
              spanish_stemmer: {
                type: 'stemmer',
                language: 'spanish'
              }
            }
          }
        },
        mappings: {
          properties: {
            id: { type: 'keyword' },
            name: {
              type: 'text',
              analyzer: 'spanish_custom',
              fields: {
                keyword: { type: 'keyword' },
                search_as_you_type: { 
                  type: 'search_as_you_type',
                  max_shingle_size: 3
                }
              }
            },
            manufacturer: {
              type: 'text',
              fields: { keyword: { type: 'keyword' } }
            },
            shortDescription: {
              type: 'text',
              analyzer: 'spanish_custom'
            },
            category: {
              type: 'text',
              fields: { 
                keyword: { type: 'keyword' }
              }
            },
            precio: { type: 'double' },
            rating: { type: 'integer' },
            reviews: { type: 'integer' },
            imagen: { type: 'keyword', index: false },
            images: { type: 'keyword', index: false },
            disponible: { type: 'boolean' },
            tags: { type: 'keyword' }
          }
        }
      }
    });
    
    console.log('📦 Indexando productos...');
    
    // Preparar operaciones bulk
    const operations = mockProducts.flatMap(product => [
      { index: { _index: 'productos', _id: product.id } },
      product
    ]);
    
    // Ejecutar bulk indexing
    const bulkResponse = await esClient.bulk({ 
      body: operations,
      refresh: true 
    });
    
    if (bulkResponse.errors) {
      console.error('❌ Errores durante indexación:');
      bulkResponse.items.forEach((item, i) => {
        if (item.index?.error) {
          console.error(`Error en producto ${i}:`, item.index.error);
        }
      });
    } else {
      console.log(`✅ ${mockProducts.length} productos indexados exitosamente`);
    }
    
    // Verificar count
    const count = await esClient.count({ index: 'productos' });
    console.log(`📊 Total de documentos en índice: ${count.count}`);
    
    // Mostrar ejemplo de búsqueda
    console.log('\n🔎 Probando búsqueda de ejemplo...');
    const searchResult = await esClient.search({
      index: 'productos',
      body: {
        query: { match: { name: 'dragón' } },
        size: 3
      }
    });
    
    console.log(`   Resultados para "dragón": ${searchResult.hits.total.value} encontrados`);
    searchResult.hits.hits.forEach(hit => {
      console.log(`   - ${hit._source.name} (score: ${hit._score})`);
    });
    
    console.log('\n✨ Seed completado exitosamente!\n');
    
  } catch (error) {
    console.error('❌ Error durante seed:', error);
    process.exit(1);
  }
}

// Ejecutar seed
seedElasticsearch()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
