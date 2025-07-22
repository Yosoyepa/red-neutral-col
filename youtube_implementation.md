### Arquitectura de la Implementación

Para implementar esto de manera segura y robusta en tu aplicación web, la mejor arquitectura es separar la lógica en dos partes:

1.  **Backend (Tu servidor)**: Será el encargado de la tarea compleja: comunicarse con YouTube para obtener la URL de descarga directa. Esto evita exponer lógica sensible o claves de API en el navegador del cliente.
2.  **Frontend (El navegador del usuario)**: Su única tarea será solicitar la URL de descarga a tu backend y luego ejecutar la prueba de velocidad contra esa URL, mostrando el resultado al usuario.

### Guía de Implementación Paso a Paso

A continuación se detalla el proceso para construir esta funcionalidad.

#### Paso 1: Configurar el Backend para obtener las URLs de YouTube

La forma más práctica y recomendada de obtener las URLs de los *streams* de video es utilizando una librería especializada en tu backend. Intentar hacerlo manualmente es extremadamente complejo, ya que YouTube ofusca estas URLs para proteger su contenido [1].

Para un backend en **Node.js**, una excelente opción es la librería `youtube-stream-url` [2].

1.  **Instala la librería en tu proyecto de backend:**
    ```bash
    npm install youtube-stream-url
    ```

2.  **Crea una función para obtener la información del video:**
    Esta función tomará un ID de video de YouTube y devolverá los detalles, incluyendo un listado de formatos con sus URLs de descarga directa [2].

    ```javascript
    // En tu backend (ej. server.js)
    const Youtube = require('youtube-stream-url');

    async function getYoutubeStreamUrl(videoId) {
      try {
        const videoInfo = await Youtube.getInfo({ url: `https://www.youtube.com/watch?v=${videoId}` });
        
        // Buscamos un formato de buena calidad, por ejemplo, 720p (itag 22) o 1080p.
        const videoFormat = videoInfo.formats.find(format => format.itag === '22' || format.quality === 'hd720');
        
        if (videoFormat && videoFormat.url) {
          return videoFormat.url; // ¡Esta es la URL que necesitamos!
        } else {
          // Si no se encuentra el formato específico, devolvemos la primera URL disponible
          return videoInfo.formats[0].url;
        }
      } catch (error) {
        console.error("Error obteniendo la URL del stream:", error);
        return null;
      }
    }
    ```

#### Paso 2: Crear un Endpoint en tu API de Backend

Ahora, expón la función anterior a través de un endpoint en tu API para que tu frontend pueda solicitar las URLs.
ESTE ES EL VIDEO ID A UTILIZAR PARA LAS PRUEBAS: Gov110HgI4Q
```javascript
// Usando Express.js como ejemplo
const express = require('express');
const app = express();
const port = 3000;

// ... (código de la función getYoutubeStreamUrl de arriba)

app.get('/api/get-youtube-test-url', async (req, res) => {
  // Usaremos un video de prueba (licencia libre o de tu propiedad)
  const TEST_VIDEO_ID = 'aqz-KE-bpKQ'; // Ejemplo: Video Creative Commons
  
  const streamUrl = await getYoutubeStreamUrl(TEST_VIDEO_ID);
  
  if (streamUrl) {
    res.json({ success: true, url: streamUrl });
  } else {
    res.status(500).json({ success: false, message: 'No se pudo obtener la URL de prueba de YouTube.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
```

#### Paso 3: Implementar el Medidor de Velocidad en el Frontend

En tu aplicación web (el cliente), ahora puedes llamar a tu propio backend para obtener la URL y realizar la prueba.

1.  **Llamar a tu API para obtener la URL de prueba:**
    El frontend hace una petición a `/api/get-youtube-test-url`.

2.  **Ejecutar la medición de descarga:**
    Una vez que tienes la URL, usas la API `fetch` para descargar datos y medir el rendimiento.

    ```javascript
    // En tu frontend (ej. app.js)
    async function measureYoutubeSpeed() {
      try {
        // 1. Pedir la URL de prueba a nuestro backend
        const responseApi = await fetch('/api/get-youtube-test-url');
        const data = await responseApi.json();

        if (!data.success) {
          console.error(data.message);
          alert('Error al iniciar la prueba de YouTube.');
          return;
        }

        const urlDePrueba = data.url;
        
        // 2. Medir la velocidad de descarga
        const startTime = performance.now();
        const responseVideo = await fetch(urlDePrueba);
        
        // Obtener el tamaño del archivo
        const sizeInBytes = Number(responseVideo.headers.get('content-length'));
        
        // Consumir el cuerpo de la respuesta para completar la descarga
        await responseVideo.blob(); 
        
        const endTime = performance.now();
        
        const durationInSeconds = (endTime - startTime) / 1000;
        const bitsLoaded = sizeInBytes * 8;
        const speedBps = bitsLoaded / durationInSeconds;
        const speedMbps = (speedBps / 1000000).toFixed(2);

        // 3. Mostrar el resultado
        console.log(`Velocidad de descarga desde CDN de YouTube: ${speedMbps} Mbps`);
        document.getElementById('resultado').innerText = `Velocidad (YouTube): ${speedMbps} Mbps`;

      } catch (error) {
        console.error('Error durante la medición:', error);
        alert('Ocurrió un error al realizar la prueba.');
      }
    }
    ```

Este código proporciona una medición básica. Para una prueba más robusta (similar a `fast.com`), podrías descargar datos durante un tiempo fijo (ej. 10 segundos) en lugar de descargar el archivo completo, y utilizar múltiples peticiones en paralelo para saturar la conexión y obtener una medida más precisa de la velocidad máxima.
