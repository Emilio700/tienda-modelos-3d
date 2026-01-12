# Guía de Presentación: Video Memoria (Integración y Despliegue)
**Duración Objetivo:** ~15 minutos
**Equipo:** 4 Integrantes

Esta guía estructura el video para cubrir los 5 puntos requeridos, asignando partes a cada integrante y señalando exactamente qué mostrar en pantalla **con un enfoque técnico profundo**.

---

## Estructura General y Asignación

| Sección | Tema | Integrante Sugerido | Duración Aprox. |
| :--- | :--- | :--- | :--- |
| **Intro** | Presentación del equipo y objetivo | Integrante 1 | 1 min |
| **1.** | Modificaciones Front-end (Hooks & State) | Integrante 1 | 3-4 min |
| **2.** | Back-end: ElasticSearch (Query DSL & Aggregations) | Integrante 2 | 3-4 min |
| **3.** | Despliegue Local (Docker Network & Volumes) | Integrante 3 | 3-4 min |
| **4. y 5.** | Despliegue Remoto y Conclusiones | Integrante 4 | 3-4 min |

---

## Guía Detallada por Integrante

### Integrante 1: Introducción y Front-end (Technical Deep Dive)
**Objetivo:** Explicar la lógica de cliente para consumo de microservicios.

**Puntos Técnicos Clave (Mencionar verbalmente):**
*   **Custom Hook `useSearch`**: Explicar que se centralizó toda la lógica de búsqueda, autocompletado y filtrado aquí para separar la UI de la lógica de negocio.
*   **Manejo de Estado**: Mencionar el uso de `useState` para manejar no solo los productos (`products`), sino también metadatos complejos como `facets` (para filtros dinámicos) y `suggestions` (para autocompletado en tiempo real).
*   **Comunicación**: Destacar que las peticiones van al `API_BASE_URL` (nuestro API Gateway), no directamente al microservicio, manteniendo el patrón de Gateway.

**Dónde mostrar (Pantalla y Código):**
1.  **Frontend Hook** (`frontend/src/hooks/useSearch.js`):
    *   *Línea ~62 `handleSearch`*: Mostrar cómo se construye la query parameter `q=${encodeURIComponent(term)}`.
    *   *Línea ~90 `handleAutocomplete`*: Resaltar la función que se dispara al escribir (`search-as-you-type`).
    *   *Línea ~111 `applyFilters`*: Mostrar cómo se construye el payload JSON con `categorias`, `precioMin`, etc., para enviarlo al backend.

---

### Integrante 2: Back-end y Elasticsearch (Query DSL)
**Objetivo:** Demostrar el poder de Elasticsearch sobre SQL para búsquedas.

**Puntos Técnicos Clave:**
*   **Cliente de Elastic**: Usamos `@elastic/elasticsearch` oficial.
*   **Fuzzy Search**: Explicar que la búsqueda no es exacta. Usamos `fuzziness: 'AUTO'` lo que permite encontrar productos aunque el usuario cometa errores ortográficos leves.
*   **Multi-Match Query**: Buscamos simultáneamente en múltiples campos (`name`, `shortDescription`, `category`) dándole más peso ("boost") al nombre (`name^3`).
*   **Aggregations (Facets)**: Explicar que los filtros de precio y categorías NO son queries SQL `GROUP BY` lentas, sino agregaciones nativas de Elastic que se calculan en milisegundos.

**Dónde mostrar (Pantalla y Código):**
1.  **Server Logic** (`microservicio-busqueda/server.js`):
    *   *Línea ~12 conexión*: `new Client({ node: ... })`.
    *   *Línea ~90 Query Principal*: Señalar el bloque `multi_match` y explicar:
        ```javascript
        multi_match: {
          query: q,
          fields: ['name^3', ...], // Importancia x3 al nombre
          fuzziness: 'AUTO'        // Tolerancia a typos
        }
        ```
    *   *Línea ~162 Agregaciones*: Mostrar cómo se piden los buckets de categorías y rangos de precio en una sola petición.

---

### Integrante 3: Despliegue Local (Container Orchestration)
**Objetivo:** Explicar la arquitectura de contenedores.

**Puntos Técnicos Clave:**
*   **Microservices Network**: Explicar que usamos una red puente (`bridge`) llamada `microservices-network` para que los contenedores se vean entre sí por nombre de servicio (ej. `http://elasticsearch:9200`) pero estén aislados del exterior.
*   **Persistencia**: Mencionar el volumen `elasticsearch-data` que permite que los índices de búsqueda sobrevivan aunque reiniciemos el contenedor.
*   **Healthchecks y Dependencias**: Mostrar `depends_on: condition: service_healthy` en el servicio de búsqueda, asegurando que no inicie hasta que Elastic esté 100% listo.

**Dónde mostrar (Pantalla y Código):**
1.  **Docker Compose** (`docker-compose.yml`):
    *   *Líneas 5-25*: Servicio `elasticsearch` con sus límites de memoria (`ES_JAVA_OPTS=-Xms512m`) para no saturar la máquina local.
    *   *Líneas 37-39*: La condición `depends_on` bloqueante.
    *   *Líneas 96-97*: La definición de la red interna.
2.  **Terminal**:
    *   Ejecutar `docker stats` para mostrar el consumo real de recursos en vivo (muy visual y técnico).

---

### Integrante 4: Despliegue Remoto (Demo Final)
**Objetivo:** Validar la integración en producción.

**Puntos Técnicos Clave:**
*   **Reverse Proxy**: Mencionar que en producción Nginx (Gateway) maneja el enrutamiento y sirve los estáticos del frontend.
*   **Integración Real**: Demostrar que la latencia es mínima gracias a la indexación previa.

**Dónde mostrar:**
1.  **Navegador (Producción):**
    *   Realizar una búsqueda "difusa" (ej. buscar "impresion" sin acento o "filaento" con error) y mostrar que Elastic lo encuentra igual. Esto valida la configuración de `fuzziness` explicada por el Integrante 2.
    *   Usar los filtros de facetas (precio/categoría) y mencionar "Esta respuesta viene de las agregaciones de Elastic".

---

## Checklist Técnico antes de grabar
- [ ] **Integrante 1**: Localizar `useSearch.js` y entender el flujo de `fetch`.
- [ ] **Integrante 2**: Tener `server.js` abierto en la línea 90 (Query) y 160 (Aggregations).
- [ ] **Integrante 3**: Tener lista la terminal con `docker stats` corriendo para mostrar métricas.
- [ ] **Todos**: Asegurar que los contenedores tienen nombres legibles en Docker Desktop.
