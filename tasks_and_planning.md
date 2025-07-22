### **Plan de Acción y Arquitectura: "Red Neutral"**

Este documento detalla las fases, tareas y estructura de directorios para el desarrollo del prototipo de la aplicación de medición de neutralidad de red.

---

#### **Fase 0: Fundación y Configuración del Proyecto (Sprint 0)**

El objetivo de esta fase es establecer una base sólida, automatizada y escalable antes de escribir la primera línea de código de la funcionalidad principal.

* **Tarea 1: Control de Versiones y Entorno de Desarrollo**
    * **Puntos a abordar:**
        * Inicializar un repositorio en **GitHub**.
        * Definir las ramas de trabajo (`main` para producción, `develop` para integración y `feature/` para nuevas funcionalidades).
        * Crear un archivo `.gitignore` optimizado para Next.js.
        * Estandarizar el gestor de paquetes (`pnpm` recomendado por su eficiencia).

* **Tarea 2: Inicialización del Proyecto y Estructura de Directorios**
    * **Puntos a abordar:**
        * Inicializar el proyecto con el comando: `npx create-next-app@latest red-neutral --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
        * Esta configuración nos da una estructura moderna usando el App Router.
    * **Arquitectura de Directorios (`/src`):**
        ```
        /src
        ├── /app                    # Rutas y UI principal (App Router)
        │   ├── /api                # API Routes para el backend
        │   │   └── /results
        │   │       └── route.ts
        │   ├── /(main)             # Grupo de rutas principal
        │   │   ├── /results
        │   │   │   └── /[id]
        │   │   │       └── page.tsx
        │   │   ├── page.tsx        # Página de inicio
        │   │   └── layout.tsx
        │   ├── /lib                # Lógica compartida, helpers, cliente de DB
        │   │   ├── prisma.ts       # Instancia del cliente de Prisma
        │   │   └── utils.ts
        │   ├── /components         # Componentes React reutilizables
        │   │   ├── /ui             # Componentes de UI genéricos (Button, Card, Input)
        │   │   └── /features       # Componentes específicos de una funcionalidad
        │   │       └── /speed-test
        │   │           └── SpeedTest.tsx
        │   └── global.css
        ├── /public                 # Archivos estáticos (imágenes, favicons)
        ├── /prisma                 # Configuración de Prisma ORM
        │   └── schema.prisma
        └── ...                     # Archivos de configuración (tailwind, next, etc.)
        ```

* **Tarea 3: Configuración de Infraestructura y Despliegue Continuo (CI/CD)**
    * **Puntos a abordar:**
        * Crear un nuevo proyecto en **Vercel** y conectarlo al repositorio de GitHub.
        * Configurar el despliegue automático para la rama `main` y las `preview deployments` para cada `pull request`.
        * Crear la base de datos **Vercel Postgres**.
        * Obtener la URL de conexión y añadirla como variable de entorno (`DATABASE_URL`) en el proyecto de Vercel.

* **Tarea 4: Configuración del ORM y Esquema de la Base de Datos**
    * **Puntos a abordar:**
        * Instalar Prisma: `pnpm install prisma`.
        * Inicializar Prisma: `npx prisma init --datasource-provider postgresql`.
        * Definir el modelo de datos en `prisma/schema.prisma`.
            ```prisma
            model TestResult {
              id              String   @id @default(cuid())
              isp             String
              city            String
              downloadSpeed   Float    // en Mbps
              uploadSpeed     Float    // en Mbps
              latency         Int      // en ms
              jitter          Int      // en ms
              throttlingRatio Float?   // Ratio entre tu servidor y uno público
              createdAt       DateTime @default(now())
            }
            ```
        * Ejecutar `npx prisma db push` para sincronizar el esquema con la base de datos de Vercel.

---

#### **Fase 1: Desarrollo del Producto Mínimo Viable (MVP)**

El objetivo es construir la funcionalidad central de la aplicación.

* **Tarea 1: Construcción de la Interfaz de Usuario Principal**
    * **Puntos a abordar:**
        * Desarrollar la página de inicio (`/app/(main)/page.tsx`) como un **React Server Component (RSC)**.
        * Crear los campos de entrada para "Proveedor de Internet (ISP)" y "Ciudad".
        * Diseñar el botón "Iniciar Prueba".

* **Tarea 2: Implementación de la Lógica de Medición (Client-Side)**
    * **Puntos a abordar:**
        * Crear el componente `SpeedTest.tsx` como un **Client Component** (`'use client'`).
        * **Fundamental:** Implementar la lógica de medición dentro de un **Web Worker** para no bloquear el hilo principal de la UI.
        * **Descarga:** Realizar un `fetch` a un archivo de tamaño conocido servido desde `/public` y medir el tiempo.
        * **Subida:** Generar un `Blob` de datos aleatorios y enviarlo vía `POST` a una API Route vacía, midiendo el tiempo.
        * **Latencia/Jitter:** Realizar múltiples peticiones pequeñas a una API Route y medir el tiempo de respuesta promedio (latencia) y su desviación estándar (jitter).

* **Tarea 3: Backend para la Persistencia de Datos**
    * **Puntos a abordar:**
        * Desarrollar la API Route en `/app/api/results/route.ts`.
        * Crear una función `POST` que reciba los resultados del cliente.
        * Validar los datos de entrada usando **Zod** para garantizar la integridad y seguridad.
        * Utilizar el cliente de Prisma para guardar el `TestResult` validado en la base de datos.
        * Retornar el `id` del resultado creado para poder redirigir al usuario.

* **Tarea 4: Página de Visualización de Resultados**
    * **Puntos a abordar:**
        * Desarrollar la ruta dinámica `/app/(main)/results/[id]/page.tsx`.
        * Esta página será un RSC que obtendrá los datos del test desde la base de datos usando el `id` de la URL.
        * Pasar los datos a un componente cliente que renderice los gráficos usando `Recharts` o `Chart.js`.
        * Mostrar de forma clara: velocidad, latencia y una conclusión inicial sobre la prueba de neutralidad.

---

#### **Fase 2: Lanzamiento Beta e Iteración**

El objetivo es lanzar el producto a un grupo cerrado, recolectar datos y feedback para mejorar.

* **Tarea 1: Pruebas End-to-End y Despliegue**
    * **Puntos a abordar:**
        * Realizar pruebas completas en el entorno de `preview` de Vercel.
        * Fusionar la rama `develop` en `main` para desplegar el MVP a producción.

* **Tarea 2: Lanzamiento Beta**
    * **Puntos a abordar:**
        * Compartir el enlace de la aplicación con comunidades de tecnología en Colombia (ej. Colombia Dev, foros locales).
        * Habilitar **Vercel Analytics** y **Speed Insights** para monitorear el rendimiento y el uso real.

* **Tarea 3: Incorporar Feedback y Funcionalidades Adicionales**
    * **Puntos a abordar:**
        * Crear un `backlog` con las funcionalidades deseadas: mapa nacional, contenido educativo, pruebas avanzadas.
        * Priorizar el desarrollo de un mapa de resultados (`/map`) como siguiente gran funcionalidad.
        * Añadir páginas estáticas con contenido educativo sobre la neutralidad de la red en Colombia, aprovechando el renderizado estático (SSG) de Next.js para un rendimiento óptimo.