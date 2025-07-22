# Plan de Tareas: Prototipo Funcional Red Neutral COL

Este documento describe las fases y tareas necesarias para convertir el proyecto actual en un prototipo completamente funcional, reemplazando los datos estáticos con lógica de negocio y cálculos reales.

---

### Fase 1: Cálculo de Promedios en el Backend

**Objetivo:** Reemplazar los promedios de velocidad hardcodeados con valores calculados dinámicamente desde la base de datos.
**Nombre de la Rama:** `feature/backend-result-calculations`

-   [ ] **Tarea 1.1: Modificar la consulta de la página de resultados.**
    -   En `src/app/results/[id]/page.tsx`, ampliar la lógica para consultar la base de datos antes de renderizar el componente.

-   [ ] **Tarea 1.2: Implementar la función de cálculo de promedio por ciudad.**
    -   Crear una función que use Prisma para obtener todos los resultados de la misma ciudad que el resultado actual.
    -   Calcular la velocidad de descarga, subida y latencia promedio para esa ciudad.

-   [ ] **Tarea 1.3: Implementar la función de cálculo de promedio por ISP.**
    -   Crear una función que use Prisma para obtener todos los resultados del mismo ISP que el resultado actual.
    -   Calcular la velocidad de descarga, subida y latencia promedio para ese ISP.

-   [ ] **Tarea 1.4: Integrar los promedios en el componente de resultados.**
    -   Pasar los promedios calculados (ciudad e ISP) como `props` al componente `ResultsScreen`.
    -   Modificar `ResultsScreen.tsx` para que consuma y muestre estos `props` en lugar de los valores estáticos.

---

### Fase 2: Implementación del Puntaje de Neutralidad

**Objetivo:** Desarrollar e implementar el algoritmo para calcular y mostrar un puntaje de neutralidad real.
**Nombre de la Rama:** `feature/neutrality-score-logic`

-   [ ] **Tarea 2.1: Definir el algoritmo del puntaje de neutralidad.**
    -   Establecer una fórmula matemática para el puntaje. Debe comparar los resultados del usuario con los promedios calculados en la Fase 1 (ej. `(velocidadUsuario / promedioISP) * 100`).
    -   Definir los umbrales para los estados ("Neutral", "Posible Throttling", etc.).

-   [ ] **Tarea 2.2: Implementar la lógica de cálculo.**
    -   En `src/app/results/[id]/page.tsx`, añadir la lógica para calcular el puntaje y determinar el estado de neutralidad usando los datos del resultado actual y los promedios de la Fase 1.

-   [ ] **Tarea 2.3: Actualizar el componente de la interfaz.**
    -   Pasar el puntaje y el estado calculados como `props` a `ResultsScreen`.
    -   Modificar `ResultsScreen.tsx` para mostrar dinámicamente el puntaje y el estado de neutralidad.

---

### Fase 3: Pruebas de Comparación de Servicios (Avanzado)

**Objetivo:** Reemplazar los datos estáticos de comparación de servicios con mediciones reales o simuladas.
**Nombre de la Rama:** `feature/service-comparison-tests`

-   [ ] **Tarea 3.1: Investigar y definir la estrategia de prueba.**
    -   Investigar si existen endpoints públicos de servicios como Netflix o YouTube para realizar pruebas de velocidad (puede ser complejo o ir contra los términos de servicio).
    -   **Alternativa:** Diseñar una simulación que mida la velocidad contra servidores que imiten el tipo de tráfico de streaming (ej. descargas de archivos de mayor tamaño y duración).

-   [ ] **Tarea 3.2: Modificar el Worker de prueba de velocidad.**
    -   Actualizar `public/speed-test-worker.js` para incluir las nuevas pruebas de comparación definidas en la tarea anterior.

-   [ ] **Tarea 3.3: Actualizar el backend y la base de datos.**
    -   Modificar el endpoint `/api/speed-test` para recibir y procesar los nuevos datos de las pruebas de comparación.
    -   Si es necesario, migrar la base de datos (`schema.prisma`) para añadir campos donde almacenar estos nuevos resultados.

-   [ ] **Tarea 3.4: Integrar en la página de resultados.**
    -   Actualizar `ResultsScreen.tsx` para mostrar los datos de comparación de servicios obtenidos de la base de datos para el resultado actual.