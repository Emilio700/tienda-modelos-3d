// Datos de ejemplo para productos de modelos 3D
// Este archivo simula una base de datos de productos

import dragonImg from '../assets/products/minidragon2.jpg';
import dragonImg2 from '../assets/products/minidragon3.jpg';
import spaceshipImg from '../assets/products/spaceship_stl_1764920953123.png';
import spaceshipImg2 from '../assets/products/spaceship_stl_2.png';
import cathedralImg from '../assets/products/cathedral_stl_1764920966827.png';
import cathedralImg2 from '../assets/products/cathedral_stl_2.png';
import gearsImg from '../assets/products/gears_set_stl_1764920981853.png';
import gearsImg2 from '../assets/products/gears_set_stl_2png.png';
import vaseImg from '../assets/products/vase_collection_stl_1764921003743.png';
import vaseImg2 from '../assets/products/vase_collection_stl_2.png';
import chessImg from '../assets/products/chess_set_stl_1764921019139.png';
import chessImg2 from '../assets/products/chess_set_stl_2.png';
import robotImg from '../assets/products/robot_pack_stl_1764921033384.png';
import robotImg2 from '../assets/products/robot_pack_stl_2.png';
import carImg from '../assets/products/vintage_car_stl_1764921046131.png';
import carImg2 from '../assets/products/car2.jpg';
import cityImg from '../assets/products/modular_city_stl_1764921060088.png';
import cityImg2 from '../assets/products/modular_city_stl_2.png';
import articulatedDragonImg from '../assets/products/dragonarticulado1.jpg';
import articulatedDragonImg2 from '../assets/products/dragonarticulado2.jpg'; 
import toolOrganizerImg from '../assets/products/tool_organizer_stl_1764921099588.png';
import toolOrganizerImg2 from '../assets/products/tool_organizer_stl_2.png';
import terrainImg from '../assets/products/fantasy_terrain_stl_1764921116651.png';
import terrainImg2 from '../assets/products/fantasy_terrain_stl_2.png';
import wallArtImg from '../assets/products/wall_art_stl_1764921133006.png';
import wallArtImg2 from '../assets/products/wall_art_stl_2.png';
import lunarLanderImg from '../assets/products/lunar_lander_stl_1764921148192.png';
import lunarLanderImg2 from '../assets/products/NAVE2.jpg';
import phoneStandsImg from '../assets/products/phone_stands_stl_1764921164288.png';
import phoneStandsImg2 from '../assets/products/phone_stands_stl_2.png';

const mockProducts = [
  {
    id: '1',
    name: 'Miniatura de Dragón Fantástico',
    manufacturer: 'MakerBot Models',
    category: 'Personajes y Miniaturas',
    shortDescription: 'Modelo detallado de dragón fantástico perfecto para juegos de mesa',
    longDescription: 'Esta miniatura de dragón altamente detallada presenta escamas intrincadas, alas y una pose dinámica. Perfecto para juegos de rol de mesa, dioramas o exhibición. El modelo está optimizado para impresión FDM y de resina con excelente retención de detalles. Incluye versión pre-soportada para impresión en resina.',
    price: 149.99,
    images: [dragonImg, dragonImg2],
    fileFormat: 'STL, OBJ',
    polygonCount: 250000,
    printTime: '12-15 horas',
    fileSize: '85 MB',
    featured: true,
    rating: 4.8,
    reviews: 234
  },
  {
    id: '2',
    name: 'Nave Espacial Futurista',
    manufacturer: 'TechDesign Studio',
    category: 'Vehículos y Máquinas',
    shortDescription: 'Nave espacial de ciencia ficción con componentes modulares',
    longDescription: 'Un elegante modelo de nave espacial futurista con partes modulares que se pueden imprimir por separado y ensamblar. Presenta componentes de motor detallados, interior de cabina y tren de aterrizaje. Ideal para entusiastas de la ciencia ficción y coleccionistas de modelos. Compatible con modificaciones de iluminación LED.',
    price: 199.99,
    images: [spaceshipImg2, spaceshipImg],
    fileFormat: 'STL, 3MF',
    polygonCount: 180000,
    printTime: '18-20 horas',
    fileSize: '120 MB',
    featured: true,
    rating: 4.9,
    reviews: 189
  },
  {
    id: '3',
    name: 'Catedral Gótica',
    manufacturer: 'Creative Crafts',
    category: 'Arquitectura y Edificios',
    shortDescription: 'Arquitectura detallada de catedral medieval',
    longDescription: 'Impresionante modelo de catedral gótica con arbotantes, patrones de vitrales y detalles complejos de mampostería. Se puede imprimir como un todo o en secciones. Perfecto para entusiastas de la arquitectura, terrenos de wargaming o propósitos educativos.',
    price: 89.99,
    images: [cathedralImg2, cathedralImg],
    fileFormat: 'STL',
    polygonCount: 320000,
    printTime: '24-28 horas',
    fileSize: '150 MB',
    featured: false,
    rating: 4.7,
    reviews: 156
  },
  {
    id: '4',
    name: 'Set de Engranajes Mecánicos',
    manufacturer: '3D Innovators',
    category: 'Herramientas y Gadgets',
    shortDescription: 'Sistema funcional de engranajes entrelazados',
    longDescription: '¡Un conjunto de engranajes de ingeniería de precisión que realmente funcionan! Perfecto para demostraciones educativas, rompecabezas mecánicos o esculturas cinéticas decorativas. Todos los engranajes están diseñados para engranar perfectamente cuando se imprimen a la escala correcta. Incluye instrucciones de montaje y guías de tolerancia.',
    price: 45.50,
    images: [gearsImg2, gearsImg],
    fileFormat: 'STL, STEP',
    polygonCount: 95000,
    printTime: '6-8 horas',
    fileSize: '42 MB',
    featured: true,
    rating: 4.6,
    reviews: 302
  },
  {
    id: '5',
    name: 'Colección de Jarrones Abstractos',
    manufacturer: 'PrintLab 3D',
    category: 'Arte y Decoración',
    shortDescription: 'Set de 3 jarrones geométricos modernos',
    longDescription: 'Colección de tres jarrones geométricos únicos con diseños abstractos modernos. Cada jarrón presenta un patrón diferente y puede contener flores reales o artificiales. Opción de diseño impermeable incluida. Estas piezas de conversación mejorarán cualquier interior moderno.',
    price: 34.99,
    images: [vaseImg2, vaseImg],
    fileFormat: 'STL, 3MF',
    polygonCount: 68000,
    printTime: '8-10 horas',
    fileSize: '28 MB',
    featured: false,
    rating: 4.5,
    reviews: 127
  },
  {
    id: '6',
    name: 'Set de Ajedrez - Diseño Moderno',
    manufacturer: 'MakerBot Models',
    category: 'Gaming y Juegos de Mesa',
    shortDescription: 'Set completo de ajedrez moderno con tablero',
    longDescription: 'Un conjunto completo de ajedrez con diseño minimalista moderno. Incluye las 32 piezas (16 blancas, 16 negras) más secciones de tablero imprimibles. Las piezas son compatibles con base ponderada para estabilidad. Regalo perfecto para entusiastas del ajedrez o como pieza de exhibición.',
    price: 67.00,
    images: [chessImg2, chessImg],
    fileFormat: 'STL',
    polygonCount: 145000,
    printTime: '15-18 horas',
    fileSize: '95 MB',
    featured: false,
    rating: 4.8,
    reviews: 198
  },
  {
    id: '7',
    name: 'Pack de Personajes Robot',
    manufacturer: 'TechDesign Studio',
    category: 'Personajes y Miniaturas',
    shortDescription: '5 personajes robot únicos',
    longDescription: 'Pack de 5 modelos únicos de personajes robot, cada uno con personalidad y diseño distintivos. Perfecto para animación, desarrollo de juegos o figuras coleccionables. Los modelos están listos para rigging e incluyen plantillas de textura. Van desde robots compañeros lindos hasta mecanoides amenazantes.',
    price: 129.99,
    images: [robotImg2, robotImg],
    fileFormat: 'STL, OBJ, FBX',
    polygonCount: 200000,
    printTime: '20-25 horas',
    fileSize: '180 MB',
    featured: true,
    rating: 4.9,
    reviews: 276
  },
  {
    id: '8',
    name: 'Modelo de Auto Clásico',
    manufacturer: 'Creative Crafts',
    category: 'Vehículos y Máquinas',
    shortDescription: 'Réplica de auto deportivo clásico de los años 60',
    longDescription: 'Réplica altamente detallada de un auto deportivo clásico de la década de 1960. Presenta puertas que se abren, compartimento de motor detallado e interior auténtico. Se puede imprimir en varias escalas. Incluye versiones sólidas y huecas para diferentes necesidades de impresión. Perfecto para entusiastas automotrices.',
    price: 175.00,
    images: [carImg2, carImg],
    fileFormat: 'STL, 3MF',
    polygonCount: 280000,
    printTime: '22-26 horas',
    fileSize: '165 MB',
    featured: false,
    rating: 4.7,
    reviews: 143
  },
  {
    id: '9',
    name: 'Paisaje Urbano Modular',
    manufacturer: 'PrintLab 3D',
    category: 'Arquitectura y Edificios',
    shortDescription: 'Bloques de construcción de ciudad personalizables',
    longDescription: 'Crea tu propia ciudad en miniatura con este sistema de construcción modular. Incluye oficinas, tiendas, apartamentos y accesorios. Todas las piezas se conectan perfectamente para configuraciones infinitas. Excelente para maquetas de ferrocarril, juegos de mesa o demostraciones de planificación urbana.',
    price: 95.50,
    images: [cityImg2, cityImg],
    fileFormat: 'STL',
    polygonCount: 195000,
    printTime: '16-20 horas',
    fileSize: '112 MB',
    featured: true,
    rating: 4.8,
    reviews: 221
  },
  {
    id: '10',
    name: 'Dragón Articulado',
    manufacturer: '3D Innovators',
    category: 'Personajes y Miniaturas',
    shortDescription: 'Dragón completamente articulado y posable',
    longDescription: '¡Increíble dragón articulado que se imprime completamente ensamblado! Presenta articulaciones móviles en alas, patas, cola y cuello. No se requiere montaje ni soportes. Este modelo de impresión en el lugar muestra las capacidades de la impresión 3D moderna. Horas de diversión de pose garantizadas.',
    price: 78.99,
    images: [articulatedDragonImg2, articulatedDragonImg],
    fileFormat: 'STL, 3MF',
    polygonCount: 125000,
    printTime: '10-12 horas',
    fileSize: '68 MB',
    featured: true,
    rating: 4.9,
    reviews: 412
  },
  {
    id: '11',
    name: 'Sistema Organizador de Herramientas',
    manufacturer: 'MakerBot Models',
    category: 'Herramientas y Gadgets',
    shortDescription: 'Organización modular de taller',
    longDescription: 'Sistema organizador modular de grado profesional para tu taller. Incluye cajones, contenedores, soportes y paneles montados en la pared. Totalmente personalizable y expandible. Lo suficientemente resistente para uso real en el taller. Incluye agujeros para imanes y etiquetas.',
    price: 52.00,
    images: [toolOrganizerImg2, toolOrganizerImg],
    fileFormat: 'STL, STEP',
    polygonCount: 87000,
    printTime: '12-14 horas',
    fileSize: '56 MB',
    featured: false,
    rating: 4.7,
    reviews: 189
  },
  {
    id: '12',
    name: 'Set de Terreno Fantástico',
    manufacturer: 'Creative Crafts',
    category: 'Gaming y Juegos de Mesa',
    shortDescription: 'Colección completa de terreno D&D',
    longDescription: 'Colección masiva de piezas de terreno fantástico para juegos de rol de mesa. Incluye árboles, rocas, ruinas, cercas, barriles y más. Compatible con miniaturas de 28mm. El diseño modular permite innumerables configuraciones de campo de batalla. Esencial para maestros de juego.',
    price: 110.00,
    images: [terrainImg2, terrainImg],
    fileFormat: 'STL',
    polygonCount: 310000,
    printTime: '30-35 horas',
    fileSize: '225 MB',
    featured: true,
    rating: 4.9,
    reviews: 367
  },
  {
    id: '13',
    name: 'Arte Geométrico de Pared',
    manufacturer: 'PrintLab 3D',
    category: 'Arte y Decoración',
    shortDescription: 'Paneles de decoración de pared 3D modernos',
    longDescription: 'Set de 9 paneles geométricos que crean un impresionante arte de pared 3D. Cada panel presenta patrones únicos que crean hermosas sombras y profundidad. Se pueden organizar en múltiples configuraciones. Superficie compatible con pintura para colores personalizados. Transforma cualquier pared en una obra de arte moderna.',
    price: 58.50,
    images: [wallArtImg2, wallArtImg],
    fileFormat: 'STL, 3MF',
    polygonCount: 92000,
    printTime: '14-16 horas',
    fileSize: '74 MB',
    featured: false,
    rating: 4.6,
    reviews: 134
  },
  {
    id: '14',
    name: 'Modelo de Módulo Lunar',
    manufacturer: 'TechDesign Studio',
    category: 'Vehículos y Máquinas',
    shortDescription: 'Módulo de aterrizaje lunar estilo Apollo',
    longDescription: 'Réplica detallada del icónico módulo de aterrizaje lunar. Presenta patas de aterrizaje extensibles, interior detallado y figuras de astronautas. Históricamente preciso con increíble detalle. Perfecto para entusiastas del espacio y educadores. Incluye soporte de exhibición.',
    price: 142.00,
    images: [lunarLanderImg2, lunarLanderImg],
    fileFormat: 'STL, OBJ',
    polygonCount: 165000,
    printTime: '16-18 horas',
    fileSize: '98 MB',
    featured: false,
    rating: 4.8,
    reviews: 167
  },
  {
    id: '15',
    name: 'Trío de Soportes de Teléfono',
    manufacturer: '3D Innovators',
    category: 'Herramientas y Gadgets',
    shortDescription: '3 soportes de teléfono elegantes',
    longDescription: 'Colección de tres diseños únicos de soportes de teléfono: minimalista, geométrico y orgánico. Cada uno sostiene los teléfonos de forma segura en el ángulo de visualización perfecto. Ranuras de gestión de cables incluidas. Adecuado para escritorios, mesitas de noche o encimeras de cocina. Se recomiendan almohadillas de base antideslizantes.',
    price: 24.99,
    images: [phoneStandsImg2, phoneStandsImg],
    fileFormat: 'STL',
    polygonCount: 45000,
    printTime: '4-6 horas',
    fileSize: '22 MB',
    featured: false,
    rating: 4.5,
    reviews: 289
  }
];

export default mockProducts;
