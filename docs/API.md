# 📚 Documentación de la API - Red Neutral COL

## Descripción General

La API de Red Neutral COL proporciona endpoints para realizar pruebas de velocidad, detectar throttling y compartir resultados de forma anónima.

## Base URL

```
Producción: https://red-neutral-col.vercel.app/api
Desarrollo: http://localhost:3000/api
```

## Autenticación

La API actualmente no requiere autenticación. Todos los endpoints son públicos.

## Endpoints

### 1. Pruebas de Velocidad

#### `GET /api/test/download`

Genera chunks de datos para pruebas de descarga.

**Respuesta:**
- Content-Type: `application/octet-stream`
- Body: Datos binarios aleatorios (5MB por chunk)

#### `POST /api/upload-test`

Recibe datos para pruebas de subida.

**Request Body:**
```json
{
  "data": "string (base64 encoded)",
  "timestamp": 1234567890
}
```

**Respuesta:**
```json
{
  "success": true,
  "bytesReceived": 5242880,
  "timestamp": 1234567890
}
```

### 2. Pruebas de Servicios Específicos

#### `GET /api/test/youtube`

Simula tráfico de video streaming.

**Query Parameters:**
- `quality`: string (opcional) - "480p", "720p", "1080p", "4k"

**Respuesta:**
```json
{
  "streamUrl": "/api/test/youtube/stream",
  "quality": "1080p",
  "bitrate": 5000000
}
```

#### `GET /api/test/social-media`

Simula tráfico de redes sociales.

**Respuesta:**
```json
{
  "images": ["/api/test/social-media/image/1", "..."],
  "totalSize": 2097152
}
```

#### `GET /api/test/general-web`

Simula navegación web general.

**Respuesta:**
```json
{
  "resources": [
    { "url": "/api/test/general-web/html", "size": 51200 },
    { "url": "/api/test/general-web/css", "size": 20480 },
    { "url": "/api/test/general-web/js", "size": 102400 }
  ]
}
```

### 3. Gestión de Resultados

#### `POST /api/results`

Guarda los resultados de una prueba.

**Request Body:**
```json
{
  "isp": "Claro",
  "city": "Bogotá",
  "downloadSpeed": 50.5,
  "uploadSpeed": 25.3,
  "ping": 15,
  "jitter": 2.5,
  "videoStreamingSpeed": 48.2,
  "socialMediaSpeed": 49.8,
  "generalWebSpeed": 50.1
}
```

**Respuesta:**
```json
{
  "id": "cm123456789",
  "isp": "Claro",
  "city": "Bogotá",
  "downloadSpeed": 50.5,
  "uploadSpeed": 25.3,
  "ping": 15,
  "jitter": 2.5,
  "throttlingRatio": 0.96,
  "testDate": "2024-07-22T12:00:00Z"
}
```

### 4. Sistema de Compartir

#### `POST /api/share-result`

Genera un enlace único para compartir un resultado.

**Request Body:**
```json
{
  "resultId": "cm123456789"
}
```

**Respuesta:**
```json
{
  "shareId": "ABC123XY",
  "shareUrl": "https://red-neutral-col.vercel.app/share/ABC123XY"
}
```

#### `GET /api/share-result?shareId={shareId}`

Obtiene un resultado compartido.

**Respuesta:**
```json
{
  "id": "cm123456789",
  "shareId": "ABC123XY",
  "isp": "Claro",
  "city": "Bogotá",
  "downloadSpeed": 50.5,
  "uploadSpeed": 25.3,
  "ping": 15,
  "jitter": 2.5,
  "throttlingRatio": 0.96,
  "videoStreamingSpeed": 48.2,
  "socialMediaSpeed": 49.8,
  "generalWebSpeed": 50.1,
  "testDate": "2024-07-22T12:00:00Z",
  "isPublic": true
}
```

### 5. Resultados Públicos

#### `GET /api/public-results`

Lista resultados compartidos públicamente.

**Query Parameters:**
- `limit`: number (default: 10) - Número de resultados por página
- `offset`: number (default: 0) - Desplazamiento para paginación

**Respuesta:**
```json
{
  "results": [
    {
      "id": "cm123456789",
      "shareId": "ABC123XY",
      "isp": "Claro",
      "city": "Bogotá",
      "downloadSpeed": 50.5,
      "uploadSpeed": 25.3,
      "ping": 15,
      "throttlingRatio": 0.96,
      "testDate": "2024-07-22T12:00:00Z",
      "sharedAt": "2024-07-22T12:05:00Z"
    }
  ],
  "totalCount": 150,
  "hasMore": true
}
```

## Códigos de Estado

- `200 OK`: Solicitud exitosa
- `400 Bad Request`: Parámetros inválidos
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

## Límites de Tasa

- Pruebas de velocidad: 10 por hora por IP
- Otros endpoints: 100 solicitudes por minuto por IP

## Ejemplos de Uso

### JavaScript/TypeScript

```typescript
// Compartir un resultado
async function shareResult(resultId: string) {
  const response = await fetch('/api/share-result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resultId }),
  });
  
  const data = await response.json();
  console.log('Share URL:', data.shareUrl);
}

// Obtener resultados públicos
async function getPublicResults(page = 0) {
  const limit = 10;
  const offset = page * limit;
  
  const response = await fetch(`/api/public-results?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  
  return data;
}
```

### cURL

```bash
# Compartir un resultado
curl -X POST https://red-neutral-col.vercel.app/api/share-result \
  -H "Content-Type: application/json" \
  -d '{"resultId":"cm123456789"}'

# Obtener resultados públicos
curl https://red-neutral-col.vercel.app/api/public-results?limit=10&offset=0
```

## Notas de Implementación

- Todos los timestamps están en UTC
- Las velocidades se reportan en Mbps
- El ping se reporta en milisegundos
- El throttlingRatio es un valor entre 0 y 1 (1 = sin throttling)
