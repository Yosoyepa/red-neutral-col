### **Plan de Acción: `feature/connect-frontend-api`**

**Objetivo General:** Dar vida a la aplicación reemplazando la lógica simulada del frontend por mediciones de velocidad reales, enviando los resultados al API y visualizando datos reales desde la base de datos.

---

#### **Fase 1: Flujo de Datos y Lógica de Medición Real**

* **Tarea 1: Pasar Datos desde la Página de Inicio**
    * **Objetivo:** Modificar la página de inicio para que envíe el ISP y la ciudad seleccionados a la página de pruebas.
    * **Archivo a Modificar:** `src/app/page.tsx`
    * **Instrucciones:**
        1.  Importar `useRouter` de `next/navigation`.
        2.  Reemplazar la función `handleStartTest` para que, en lugar de cambiar un estado local, navegue a la página `/testing` pasando los datos del formulario como *query parameters*.

* **Tarea 2: Crear el Web Worker para la Medición de Velocidad**
    * **Objetivo:** Crear un script de Web Worker que se encargue de las mediciones de velocidad en un hilo separado para no congelar la interfaz.
    * **Acciones:**
        1.  Crear un nuevo archivo en `public/speed-test-worker.js`.
        2.  Implementar la lógica dentro de este archivo. El worker debe poder recibir un mensaje para iniciar las pruebas y enviar mensajes de vuelta con el progreso y los resultados finales.
        3.  Crear un archivo de prueba para la descarga en `public/download-test-file.bin`. Un archivo de 5-10MB es suficiente para el prototipo.

* **Tarea 3: Implementar la Lógica de Medición en la Pantalla de Pruebas**
    * **Objetivo:** Reemplazar la simulación en la página de pruebas para que use el Web Worker y muestre el progreso real.
    * **Archivo a Modificar:** `src/app/testing/page.tsx`
    * **Instrucciones:**
        1.  Usar el hook `useSearchParams` de `next/navigation` para leer los parámetros `isp` y `city` de la URL.
        2.  Usar un `useEffect` para inicializar el `Web Worker` (`new Worker('/speed-test-worker.js')`).
        3.  Configurar un listener `worker.onmessage` que actualice el estado del componente (progreso, velocidad de descarga/subida actual) según los mensajes recibidos del worker.
        4.  Al montar el componente, enviar un mensaje inicial al worker (`worker.postMessage({ type: 'start' })`) para que comience las pruebas.
        5.  Cuando el worker envíe el mensaje final con todos los resultados, proceder a la siguiente tarea.

---

#### **Fase 2: Conexión con el API y Visualización de Datos Reales**

* **Tarea 4: Enviar Resultados al API**
    * **Objetivo:** Tras completar las mediciones, enviar los resultados al endpoint `/api/results` que ya creamos.
    * **Archivo a Modificar:** `src/app/testing/page.tsx`
    * **Instrucciones:**
        1.  Dentro del listener `worker.onmessage`, cuando se reciba el mensaje de "finalizado", tomar el objeto con los resultados.
        2.  Llamar a una función asíncrona que realice una petición `fetch` de tipo `POST` a `/api/results`.
        3.  El `body` de la petición debe ser el objeto de resultados convertido a JSON.
        4.  Tras una respuesta exitosa, obtener el `id` del resultado devuelto por la API.
        5.  Usar `router.push()` para redirigir al usuario a la página de resultados dinámica: `/results/${id}`.

* **Tarea 5: Convertir la Página de Resultados en Dinámica**
    * **Objetivo:** Modificar la página de resultados para que muestre los datos de un test específico desde la base de datos, en lugar de datos estáticos.
    * **Acciones:**
        1.  Renombrar la estructura de la página de resultados de `/src/app/results/page.tsx` a `/src/app/results/[id]/page.tsx`. Esto la convierte en una ruta dinámica.
        2.  Transformar el componente de la página en un **React Server Component (RSC)**, haciéndolo `async`.
        3.  El componente recibirá `params` como prop, que contendrá `params.id`.
        4.  Dentro del componente, usar `prisma.testResult.findUnique()` para buscar en la base de datos el resultado que coincida con el `params.id`.
        5.  Manejar el caso en que no se encuentre un resultado (ej. mostrar un error de "No encontrado").
        6.  Pasar los datos obtenidos de la base de datos como `props` a los componentes de la UI (las tarjetas, los gráficos, etc.), reemplazando todos los valores hardcodeados.