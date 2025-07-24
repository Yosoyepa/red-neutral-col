# 🌐 Red Neutral COL

<div align="center">

![Red Neutral COL](https://img.shields.io/badge/Red%20Neutral-COL-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)

**Herramienta de monitoreo de neutralidad de red para Colombia**

[Demo en Vivo](https://red-neutral-col.vercel.app) | [Reportar Bug](mailto:andradeunigarrojuancarlos@gmail.com) | [Documentación](#documentación)

</div>

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [API](#-api)
- [Documentación](#-documentación)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

## 🎯 Acerca del Proyecto

**Red Neutral COL** es una herramienta web desarrollada como proyecto final para la Universidad Nacional de Colombia que permite a los usuarios medir y monitorear la neutralidad de su conexión a internet. La aplicación detecta posibles casos de throttling (limitación intencional de velocidad) por parte de los ISPs colombianos.

### Problema que Resuelve

En Colombia, los usuarios no tienen herramientas accesibles para verificar si su proveedor de internet está respetando la neutralidad de la red. Esta aplicación:

- ✅ Mide la velocidad real de la conexión
- ✅ Compara velocidades entre diferentes tipos de servicios
- ✅ Detecta posibles violaciones a la neutralidad
- ✅ Permite compartir resultados de forma anónima
- ✅ Crea transparencia en el mercado de ISPs

## ✨ Características

### 🚀 Funcionalidades Principales

- **Prueba de Velocidad Completa**
  - Medición de descarga, subida, ping y jitter
  - Comparación con promedios por ciudad e ISP
  - Detección automática de throttling

- **Análisis de Neutralidad**
  - Pruebas específicas para video streaming
  - Pruebas para redes sociales
  - Pruebas de navegación general
  - Puntuación de neutralidad (0-100)

- **Sistema de Compartir**
  - Enlaces únicos para cada resultado
  - Compartir en redes sociales
  - Resultados completamente anónimos
  - Tabla pública de resultados

- **Visualización de Datos**
  - Gráficos interactivos de comparación
  - Indicadores visuales de throttling
  - Historial de pruebas por usuario

## 🏗️ Arquitectura

> 📘 Para más detalles sobre la arquitectura del sistema, consulta la [documentación de arquitectura](docs/ARCHITECTURE.md)

### Diagrama de Flujo General

```mermaid
flowchart TB
    A[Usuario] --> B[Página Principal]
    B --> C{Seleccionar ISP y Ciudad}
    C --> D[Iniciar Prueba]
    D --> E[Web Worker]
    
    E --> F[Prueba de Descarga]
    E --> G[Prueba de Subida]
    E --> H[Prueba de Ping/Jitter]
    E --> I[Pruebas de Servicios]
    
    I --> J[Video Streaming]
    I --> K[Redes Sociales]
    I --> L[Navegación Web]
    
    F & G & H & J & K & L --> M[Cálculo de Resultados]
    M --> N[Análisis de Neutralidad]
    N --> O[Guardar en BD]
    O --> P[Mostrar Resultados]
    
    P --> Q{Usuario decide}
    Q -->|Compartir| R[Generar Link Único]
    Q -->|Nueva Prueba| B
    Q -->|Ver Mapa| S[Mapa Nacional]
```

### Arquitectura del Sistema

```mermaid
graph LR
    subgraph "Frontend"
        A[Next.js 15] --> B[React Components]
        B --> C[TanStack Query]
        B --> D[Web Workers]
    end
    
    subgraph "Backend"
        E[API Routes] --> F[Prisma ORM]
        F --> G[(PostgreSQL)]
    end
    
    subgraph "Servicios"
        H[Vercel Hosting]
        I[Supabase DB]
    end
    
    A --> E
    G --> I
    A --> H
```

### Flujo de Datos de Prueba

```mermaid
sequenceDiagram
    participant U as Usuario
    participant W as Web Worker
    participant A as API
    participant D as Database
    
    U->>W: Iniciar Prueba
    W->>A: GET /api/test/download
    A-->>W: Chunks de datos
    W->>W: Calcular velocidad
    
    W->>A: GET /api/test/upload
    W-->>A: POST datos
    W->>W: Calcular velocidad
    
    W->>A: GET /api/test/ping
    A-->>W: Tiempos de respuesta
    W->>W: Calcular latencia
    
    W->>U: Resultados en tiempo real
    W->>A: POST /api/results
    A->>D: Guardar resultado
    A-->>U: ID del resultado
```

## 🛠️ Tecnologías

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Gráficos**: Recharts
- **Estado**: TanStack Query

### Backend
- **Runtime**: Node.js
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL (Supabase)
- **Validación**: Zod

### Herramientas
- **Empaquetador**: Turbopack
- **Linting**: ESLint
- **Formato**: Prettier
- **Control de Versiones**: Git

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+ (o cuenta en Supabase)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/juanandrade/red-neutral-col.git
cd red-neutral-col
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. **Configurar la base de datos**

> 📘 Para una guía detallada de configuración de base de datos, consulta la [documentación de base de datos](docs/DATABASE_SETUP.md)

```bash
npx prisma migrate dev
npx prisma generate
```

5. **Iniciar el servidor de desarrollo**
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📖 Uso

### Realizar una Prueba

1. Accede a la página principal
2. Selecciona tu ISP (Claro, Tigo, Movistar, etc.)
3. Ingresa tu ciudad
4. Haz clic en "Iniciar Prueba"
5. Espera aproximadamente 30 segundos
6. Revisa tus resultados y el análisis de neutralidad

### Interpretar Resultados

- **Puntuación 85-100**: ✅ Sin problemas de neutralidad
- **Puntuación 70-84**: ⚠️ Posible priorización de tráfico
- **Puntuación 0-69**: ❌ Probable violación de neutralidad

### Compartir Resultados

1. En la página de resultados, haz clic en "Compartir Resultados"
2. El enlace se copiará automáticamente
3. Comparte en redes sociales o envía el enlace directo

## 🔌 API

> 📘 Para la documentación completa de la API, consulta la [documentación de API](docs/API.md)

### Endpoints Principales

#### `POST /api/results`
Guarda los resultados de una prueba
```json
{
  "isp": "Claro",
  "city": "Bogotá",
  "downloadSpeed": 50.5,
  "uploadSpeed": 25.3,
  "ping": 15,
  "jitter": 2.5
}
```

#### `GET /api/share-result?shareId={id}`
Obtiene un resultado compartido

#### `GET /api/public-results`
Lista resultados públicos con paginación
```
?limit=10&offset=0
```

### Web Workers API

#### Mensajes del Worker
```javascript
// Iniciar prueba
worker.postMessage({ type: 'start', isp: 'Claro', city: 'Bogotá' })

// Respuestas
{ type: 'progress', message: 'Midiendo descarga...' }
{ type: 'speed-update', download: 45.2 }
{ type: 'complete', results: {...} }
```

## 📚 Documentación

Para información más detallada sobre diferentes aspectos del proyecto:

- 📐 **[Arquitectura del Sistema](docs/ARCHITECTURE.md)** - Diseño técnico, patrones y decisiones arquitectónicas
- 🔌 **[Documentación de API](docs/API.md)** - Endpoints, parámetros y ejemplos de uso
- 🗄️ **[Configuración de Base de Datos](docs/DATABASE_SETUP.md)** - Guía completa para configurar PostgreSQL y Prisma
- 🚀 **[Guía de Despliegue](docs/DEPLOYMENT.md)** - Instrucciones para desplegar en producción
- 🧪 **[Guía de Pruebas](docs/TESTING.md)** - Estrategias de testing y cómo ejecutar pruebas

### Estructura del Proyecto

```
red-neutral-col/
├── app/              # Código fuente de Next.js
│   ├── api/         # API Routes
│   ├── components/  # Componentes React
│   └── lib/         # Utilidades y lógica
├── prisma/          # Schema y migraciones
├── public/          # Archivos estáticos
├── docs/            # Documentación detallada
└── tests/           # Pruebas automatizadas
```

## 🤝 Contribuir

Las contribuciones son bienvenidas y apreciadas. Para contribuir:

1. Fork el proyecto
2. Crea tu rama de característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo

- Usa TypeScript estricto
- Sigue las convenciones de ESLint
- Escribe tests para nuevas características
- Actualiza la documentación según sea necesario

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👨‍💻 Autor

**Juan Carlos Andrade Unigarro**

- 📧 Email: andradeunigarrojuancarlos@gmail.com
- 🎓 Universidad Nacional de Colombia
- 💼 LinkedIn: [Juan Carlos Andrade](https://linkedin.com/in/juan-carlos-andrade-unigarro-932220223)

### Agradecimientos

- Universidad Nacional de Colombia
- Profesores y compañeros que apoyaron el proyecto
- Comunidad open source por las herramientas utilizadas

## 🚧 Roadmap

- [x] Sistema básico de medición
- [x] Detección de throttling
- [x] Sistema de compartir resultados
- [ ] Mapa nacional de neutralidad
- [ ] API pública para desarrolladores
- [ ] Aplicación móvil
- [ ] Sistema de reportes a autoridades

---

<div align="center">
  
**Hecho con ❤️ para promover la neutralidad de red en Colombia**

[⬆ Volver arriba](#-red-neutral-col)

</div>
