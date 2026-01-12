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

// Productos mock (copiados del frontend)
const mockProducts = [
  {
    id: '1',
    nombre: 'Mini Dragón Articulado',
    descripcion: 'Modelo de dragón articulado imprimible en 3D. Piezas móviles que no requieren ensamblaje. Perfecto para coleccionistas y amantes de la fantasía. Tamaño: 15cm de largo. Compatible con cualquier impresora FDM.',
    precio: 45.99,
    categoria: 'Fantasía',
    imagen: '/images/dragon.jpg',
    imagenes: ['/images/dragon.jpg', '/images/dragon2.jpg'],
    rating: 5,
    disponible: true,
    tags: ['dragón', 'articulado', 'fantasía', 'coleccionable']
  },
  {
    id: '2',
    nombre: 'Nave Espacial Futurista',
    descripcion: 'Diseño detallado de nave espacial de ciencia ficción. Incluye soporte interno para LEDs. Modelo optimizado para impresión sin soportes. Ideal para dioramas o maquetas espaciales. Dimensiones: 20x15x8cm.',
    precio: 89.99,
    categoria: 'Ciencia Ficción',
    imagen: '/images/spaceship.jpg',
    imagenes: ['/images/spaceship.jpg', '/images/spaceship2.jpg'],
    rating: 4,
    disponible: true,
    tags: ['nave', 'espacial', 'sci-fi', 'LED']
  },
  {
    id: '3',
    nombre: 'Catedral Gótica Miniatura',
    descripcion: 'Réplica arquitectónica de catedral gótica con detalles intrincados. Modelo modular que permite personalización. Perfecto para dioramas medievales o decoración. Escala 1:100. Altura total: 35cm cuando se ensambla.',
    precio: 129.99,
    categoria: 'Arquitectura',
    imagen: '/images/cathedral.jpg',
    imagenes: ['/images/cathedral.jpg', '/images/cathedral2.jpg'],
    rating: 5,
    disponible: true,
    tags: ['catedral', 'gótico', 'arquitectura', 'medieval']
  },
  {
    id: '4',
    nombre: 'Set de Engranajes Funcionales',
    descripcion: 'Colección de 12 engranajes funcionales de diferentes tamaños. Proyecto educativo perfecto para aprender mecánica. Todas las piezas engranan perfectamente. Incluye instrucciones de ensamblaje. Material recomendado: PLA o PETG.',
    precio: 34.99,
    categoria: 'Educativo',
    imagen: '/images/gears.jpg',
    imagenes: ['/images/gears.jpg', '/images/gears2.jpg'],
    rating: 4,
    disponible: true,
    tags: ['engranajes', 'mecánica', 'educativo', 'funcional']
  },
  {
    id: '5',
    nombre: 'Colección de Jarrones Decorativos',
    descripcion: 'Pack de 5 diseños únicos de jarrones con patrones geométricos. Perfectos para plantas o decoración. Modo vaso compatible. Altura variable: 10-25cm. Impresión rápida con acabado profesional.',
    precio: 24.99,
    categoria: 'Decoración',
    imagen: '/images/vase.jpg',
    imagenes: ['/images/vase.jpg', '/images/vase2.jpg'],
    rating: 5,
    disponible: false,
    tags: ['jarrón', 'decoración', 'geométrico', 'hogar']
  },
  {
    id: '6',
    nombre: 'Ajedrez Temático Medieval',
    descripcion: 'Set completo de ajedrez (32 piezas) con temática medieval. Caballeros vs Vikingos. Incluye tablero imprimible modular. Piezas detalladas con alta calidad. Tamaño de pieza rey: 8cm. Tiempo de impresión total: ~40 horas.',
    precio: 159.99,
    categoria: 'Juegos',
    imagen: '/images/chess.jpg',
    imagenes: ['/images/chess.jpg', '/images/chess2.jpg'],
    rating: 5,
    disponible: true,
    tags: ['ajedrez', 'medieval', 'juego', 'tablero']
  },
  {
    id: '7',
    nombre: 'Pack de Robots Articulados',
    descripcion: 'Colección de 3 robots con articulaciones móviles. Diferentes estilos: retro, moderno y futurista. Sin necesidad de pegamento. Perfecto para regalo o colección. Altura promedio: 12cm por robot.',
    precio: 54.99,
    categoria: 'Robótica',
    imagen: '/images/robot.jpg',
    imagenes: ['/images/robot.jpg', '/images/robot2.jpg'],
    rating: 4,
    disponible: true,
    tags: ['robot', 'articulado', 'futurista', 'colección']
  },
  {
    id: '8',
    nombre: 'Auto Clásico Vintage',
    descripcion: 'Réplica detallada de automóvil clásico de los años 50. Puertas y capó móviles. Incluye interior detallado. Escala 1:24. Longitud: 18cm. Modelo de exhibición premium con soporte incluido.',
    precio: 79.99,
    categoria: 'Vehículos',
    imagen: '/images/car.jpg',
    imagenes: ['/images/car.jpg', '/images/car2.jpg'],
    rating: 5,
    disponible: true,
    tags: ['auto', 'vintage', 'clásico', 'coleccionable']
  },
  {
    id: '9',
    nombre: 'Ciudad Modular Sci-Fi',
    descripcion: 'Sistema modular de edificios futuristas. 15 estructuras diferentes combinables. Perfecto para wargames o dioramas. Escala 28mm (compatible con miniaturas estándar). Sistema de encastre sin pegamento.',
    precio: 199.99,
    categoria: 'Ciencia Ficción',
    imagen: '/images/city.jpg',
    imagenes: ['/images/city.jpg', '/images/city2.jpg'],
    rating: 5,
    disponible: true,
    tags: ['ciudad', 'modular', 'sci-fi', 'wargame']
  },
  {
    id: '10',
    nombre: 'Dragón Grande Articulado',
    descripcion: 'Impresionante dragón articulado de 30cm. Alas desplegables y cola flexible. Más de 20 articulaciones. Proyecto desafiante para impresoras experimentadas. Material recomendado: PLA+ o ABS. Incluye versión simplificada.',
    precio: 99.99,
    categoria: 'Fantasía',
    imagen: '/images/dragon-big.jpg',
    imagenes: ['/images/dragon-big.jpg', '/images/dragon-big2.jpg'],
    rating: 5,
    disponible: true,
    tags: ['dragón', 'grande', 'articulado', 'desafiante']
  },
  {
    id: '11',
    nombre: 'Organizador de Herramientas',
    descripcion: 'Sistema modular de organización para taller. Compartimentos personalizables. Montaje en pared o escritorio. Soporta hasta 5kg por módulo. Diseño funcional y estético. Incluye 8 configuraciones diferentes.',
    precio: 39.99,
    categoria: 'Utilidades',
    imagen: '/images/organizer.jpg',
    imagenes: ['/images/organizer.jpg', '/images/organizer2.jpg'],
    rating: 4,
    disponible: true,
    tags: ['organizador', 'herramientas', 'funcional', 'modular']
  },
  {
    id: '12',
    nombre: 'Terreno Fantástico para Miniaturas',
    descripcion: 'Set de 10 piezas de terreno variado: montañas, árboles, rocas, puentes. Compatible con D&D y Warhammer. Escala 28mm. Diseño modular intercambiable. Base hexagonal para fácil organización en mapas.',
    precio: 74.99,
    categoria: 'Juegos',
    imagen: '/images/terrain.jpg',
    imagenes: ['/images/terrain.jpg', '/images/terrain2.jpg'],
    rating: 5,
    disponible: true,
    tags: ['terreno', 'miniaturas', 'D&D', 'wargame']
  },
  {
    id: '13',
    nombre: 'Arte de Pared Geométrico',
    descripcion: 'Colección de 6 paneles decorativos con diseños geométricos 3D. Efecto de profundidad visual. Fácil montaje en pared. Dimensión por panel: 20x20cm. Combínalos para crear murales únicos. Acabado mate recomendado.',
    precio: 44.99,
    categoria: 'Decoración',
    imagen: '/images/wall-art.jpg',
    imagenes: ['/images/wall-art.jpg', '/images/wall-art2.jpg'],
    rating: 4,
    disponible: true,
    tags: ['arte', 'pared', 'geométrico', 'decoración']
  },
  {
    id: '14',
    nombre: 'Módulo Lunar',
    descripcion: 'Réplica histórica del módulo de alunizaje Apollo. Detalles auténticos basados en planos NASA. Escala 1:48. Incluye astronautas a escala. Patas desplegables. Kit educativo con información histórica.',
    precio: 109.99,
    categoria: 'Histórico',
    imagen: '/images/lunar.jpg',
    imagenes: ['/images/lunar.jpg', '/images/lunar2.jpg'],
    rating: 5,
    disponible: false,
    tags: ['lunar', 'NASA', 'histórico', 'educativo']
  },
  {
    id: '15',
    nombre: 'Templo Oriental Miniatura',
    descripcion: 'Templo asiático con arquitectura tradicional. Detalles ornamentales intrincados. Techo desmontable para acceso interior. Escala 1:87 (HO). Perfecto para maquetas ferroviarias o dioramas. Altura: 18cm.',
    precio: 94.99,
    categoria: 'Arquitectura', 
    imagen: '/images/temple.jpg',
    imagenes: ['/images/temple.jpg', '/images/temple2.jpg'],
    rating: 4,
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
                filter: ['lowercase', 'spanish_stop', 'spanish_stemmer']
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
            nombre: {
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
            descripcion: {
              type: 'text',
              analyzer: 'spanish_custom'
            },
            categoria: {
              type: 'text',
              fields: { 
                keyword: { type: 'keyword' }
              }
            },
            precio: { type: 'double' },
            rating: { type: 'integer' },
            imagen: { type: 'keyword', index: false },
            imagenes: { type: 'keyword', index: false },
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
        query: { match: { nombre: 'dragón' } },
        size: 3
      }
    });
    
    console.log(`   Resultados para "dragón": ${searchResult.hits.total.value} encontrados`);
    searchResult.hits.hits.forEach(hit => {
      console.log(`   - ${hit._source.nombre} (score: ${hit._score})`);
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
