# Plan de Tareas Pendientes para Red Neutral COL

Este documento detalla las tareas pendientes organizadas por fases para completar las características funcionales del proyecto Red Neutral COL.

---

## Fase 4: Medición Real de Servicios de Streaming
**Nombre de la Rama:** `feature/real-service-measurement`
**Objetivo:** Implementar mediciones reales de velocidad para servicios específicos como YouTube y Netflix, reemplazando las simulaciones actuales.

- [ ] **Tarea 4.1: Investigación de Estrategias de Medición**
  - Investigar métodos legales y éticos para medir velocidades de servicios específicos
  - Explorar el uso de APIs públicas o endpoints de prueba oficiales
  - Evaluar la viabilidad de usar servidores proxy que simulen el contenido de estos servicios
  - Documentar las limitaciones legales y técnicas

- [ ] **Tarea 4.2: Implementación de Mediciones por Tipo de Contenido**
  - Crear endpoints específicos que simulen diferentes tipos de tráfico:
    - `/api/test/video-streaming`: Simular descarga de chunks de video (archivos grandes secuenciales)
    - `/api/test/social-media`: Simular carga de imágenes y contenido mixto
    - `/api/test/general-web`: Simular navegación web típica (múltiples archivos pequeños)
  - Implementar lógica en el backend para servir estos diferentes tipos de contenido

- [ ] **Tarea 4.3: Actualizar Worker para Pruebas Reales**
  - Modificar `measureServiceComparison()` para usar los nuevos endpoints
  - Implementar medición de velocidad específica para cada tipo de servicio
  - Añadir manejo de errores y reintentos para pruebas más robustas

- [ ] **Tarea 4.4: Mejorar Visualización de Resultados**
  - Actualizar la UI para mostrar los resultados reales (no porcentajes simulados)
  - Añadir indicadores visuales cuando se detecte throttling significativo
  - Incluir explicaciones sobre qué significa cada métrica

---

## Fase 5: Sistema de Compartir Resultados
**Nombre de la Rama:** `feature/share-results`
**Objetivo:** Permitir a los usuarios compartir sus resultados de forma anónima para contribuir a la base de datos nacional.

- [x] **Tarea 5.1: Backend para Compartir Resultados**
  - Crear endpoint `/api/share-result` que genere un ID único compartible ✓
  - Implementar página pública `/share/[shareId]` para ver resultados compartidos ✓
  - Añadir campos en la BD para gestionar resultados compartidos (shareId, isPublic, etc.) ✓

- [x] **Tarea 5.2: Implementar Funcionalidad de Compartir**
  - Añadir onClick handler al botón "Compartir Resultados" ✓
  - Crear modal de confirmación con opciones de privacidad (simplificado - compartir directo) ✓
  - Generar enlace compartible y copiarlo al portapapeles ✓
  - Añadir opciones para compartir en redes sociales (pendiente)

- [x] **Tarea 5.3: Página de Resultado Compartido**
  - Crear componente para mostrar resultados compartidos ✓
  - Incluir marca de agua o indicador de "Resultado de Red Neutral COL" ✓
  - Añadir botón para que otros usuarios realicen su propia prueba ✓

---

## Fase 6: Mapa Nacional de Neutralidad
**Nombre de la Rama:** `feature/national-neutrality-map`
**Objetivo:** Crear un mapa interactivo de Colombia que muestre el estado de la neutralidad de red por regiones.

- [ ] **Tarea 6.1: Configuración del Mapa**
  - Integrar librería de mapas (Leaflet o Mapbox)
  - Obtener o crear GeoJSON con las regiones/departamentos de Colombia
  - Crear página `/map` para el mapa nacional

- [ ] **Tarea 6.2: API de Datos Geográficos**
  - Crear endpoint `/api/map-data` que devuelva estadísticas por región
  - Implementar agregación de datos por departamento/ciudad
  - Calcular promedios y detectar patrones de throttling por región

- [ ] **Tarea 6.3: Visualización del Mapa**
  - Implementar mapa de calor según el nivel de neutralidad
  - Añadir tooltips con estadísticas detalladas por región
  - Incluir filtros por ISP, período de tiempo y tipo de servicio
  - Añadir leyenda explicativa de los colores/niveles

- [ ] **Tarea 6.4: Integración con Resultados**
  - Implementar onClick handler en el botón "Ver Mapa Nacional"
  - Resaltar la ubicación del usuario actual en el mapa
  - Permitir comparación entre regiones

---

## Fase 7: Gráficos y Visualización Avanzada
**Nombre de la Rama:** `feature/advanced-charts`
**Objetivo:** Mejorar la visualización de resultados con gráficos interactivos que proporcionen más insights.

- [ ] **Tarea 7.1: Integración de Librería de Gráficos**
  - Instalar y configurar Chart.js o Recharts
  - Crear componentes reutilizables para diferentes tipos de gráficos

- [ ] **Tarea 7.2: Gráfico de Comparación de Velocidades**
  - Crear gráfico de barras comparando:
    - Velocidad del usuario vs. Promedio ciudad vs. Promedio ISP vs. Velocidad contratada
  - Añadir línea de referencia para la velocidad que debería tener
  - Incluir indicadores visuales de throttling

- [ ] **Tarea 7.3: Gráfico de Rendimiento por Servicio**
  - Crear gráfico radial (spider chart) mostrando el rendimiento de cada servicio
  - Comparar con el rendimiento esperado (100%)
  - Resaltar servicios con posible throttling

- [ ] **Tarea 7.4: Timeline de Velocidad**
  - Si el usuario tiene múltiples pruebas, mostrar evolución temporal
  - Identificar patrones (throttling en horarios específicos)
  - Permitir zoom y filtrado por fechas

---

## Fase 8: Sistema de Reportes y Denuncias
**Nombre de la Rama:** `feature/reporting-system`
**Objetivo:** Permitir a los usuarios generar reportes formales y presentar denuncias sobre violaciones a la neutralidad de red.

- [ ] **Tarea 8.1: Generación de Reportes PDF**
  - Implementar generación de PDF con los resultados de la prueba
  - Incluir gráficos, datos técnicos y explicaciones
  - Añadir sello de tiempo y firma digital

- [ ] **Tarea 8.2: Sistema de Denuncias**
  - Crear formulario para reportar violaciones a la CRC
  - Adjuntar automáticamente los datos de la prueba
  - Implementar seguimiento del estado de la denuncia

- [ ] **Tarea 8.3: Base de Datos de Casos**
  - Crear sección pública con casos documentados de throttling
  - Permitir búsqueda y filtrado por ISP, región y tipo de violación
  - Mostrar estadísticas de resolución de casos

---

## Fase 9: Optimizaciones y Mejoras de Rendimiento
**Nombre de la Rama:** `feature/performance-optimization`
**Objetivo:** Mejorar la precisión de las mediciones y el rendimiento general de la aplicación.

- [ ] **Tarea 9.1: Mejorar Precisión de Mediciones**
  - Implementar múltiples servidores de prueba
  - Añadir selección automática del servidor más cercano
  - Implementar algoritmos de descarte de outliers

- [ ] **Tarea 9.2: Optimización del Worker**
  - Implementar pruebas adaptativas (ajustar duración según estabilidad)
  - Mejorar el algoritmo de medición para conexiones lentas
  - Añadir detección de congestión de red

- [ ] **Tarea 9.3: Caché y Performance**
  - Implementar caché de resultados agregados
  - Optimizar consultas a la base de datos
  - Añadir paginación donde sea necesario

---

## Consideraciones Adicionales

### Prioridad de Implementación
1. **Alta Prioridad**: Fases 4, 5 y 7 (funcionalidad core pendiente)
2. **Media Prioridad**: Fases 6 y 8 (características importantes pero no críticas)
3. **Baja Prioridad**: Fase 9 (optimizaciones)

### Recursos Necesarios
- Investigación legal sobre medición de servicios comerciales
- Servidor(es) adicional(es) para pruebas distribuidas
- Licencias para servicios de mapas si se requieren
- Posible asesoría legal para el sistema de denuncias

### Métricas de Éxito
- Precisión de las mediciones de servicios específicos
- Número de usuarios compartiendo resultados
- Casos de throttling detectados y reportados
- Cobertura geográfica del mapa nacional

