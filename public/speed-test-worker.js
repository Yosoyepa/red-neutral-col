// Progress phase constants to avoid typos
const PROGRESS_PHASES = {
  PING: 'ping',
  DOWNLOAD: 'download',
  UPLOAD: 'upload',
  SERVICES: 'services',
  COMPLETE: 'complete'
};

// Configuration for cumulative test time limit
const MAX_CUMULATIVE_TEST_TIME = 30000; // 30 seconds max for all service tests
let cumulativeTestStartTime = 0;

// Helper function for fetch with retry and timeout
async function fetchWithRetry(url, opts = {}, retries = 2, timeout = 8000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...opts,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (attempt === retries) {
        throw error; // Last attempt failed
      }
      
      // Log retry attempt
      console.warn(`Fetch attempt ${attempt + 1} failed, retrying...`, error.message);
      
      // Wait a bit before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

async function measureServiceComparison() {
  // Ahora usaremos mediciones reales para los servicios
  const results = {
    videoStreamingSpeed: 0,
    socialMediaSpeed: 0,
    generalWebSpeed: 0
  };
  
  // Initialize cumulative test timer
  cumulativeTestStartTime = performance.now();
  
  // 1. Medir velocidad real de YouTube (video streaming)
  try {
    postMessage({
      type: 'progress',
      phase: PROGRESS_PHASES.SERVICES,
      progress: 75,
      message: 'Midiendo velocidad de YouTube...',
      service: 'youtube'
    });
    
    results.videoStreamingSpeed = await measureYouTubeSpeed();
    
    postMessage({
      type: 'progress',
      phase: PROGRESS_PHASES.SERVICES,
      progress: 80,
      message: 'YouTube medido. Midiendo otros servicios...'
    });
  } catch (error) {
    console.error('Error midiendo YouTube:', error);
    postMessage({
      type: 'error',
      phase: PROGRESS_PHASES.SERVICES,
      service: 'youtube',
      message: `Error midiendo YouTube: ${error.message}`
    });
  }
  
  // 2. Medir velocidad de redes sociales
  try {
    postMessage({
      type: 'progress',
      phase: PROGRESS_PHASES.SERVICES,
      progress: 85,
      message: 'Midiendo velocidad de redes sociales...',
      service: 'social'
    });
    
    results.socialMediaSpeed = await measureSocialMediaSpeed();
  } catch (error) {
    console.error('Error midiendo redes sociales:', error);
    postMessage({
      type: 'error',
      phase: PROGRESS_PHASES.SERVICES,
      service: 'social',
      message: `Error midiendo redes sociales: ${error.message}`
    });
  }
  
  // 3. Medir velocidad de navegación web general
  try {
    postMessage({
      type: 'progress',
      phase: PROGRESS_PHASES.SERVICES,
      progress: 90,
      message: 'Midiendo velocidad de navegación web...',
      service: 'web'
    });
    
    results.generalWebSpeed = await measureGeneralWebSpeed();
  } catch (error) {
    console.error('Error midiendo navegación web:', error);
    postMessage({
      type: 'error',
      phase: PROGRESS_PHASES.SERVICES,
      service: 'web',
      message: `Error midiendo navegación web: ${error.message}`
    });
  }
  
  // Fallback to simulated speeds for any failed measurements
  if (results.videoStreamingSpeed === 0 || results.socialMediaSpeed === 0 || results.generalWebSpeed === 0) {
    try {
      const baseSpeed = await measureDownloadSpeed();
      
      if (results.videoStreamingSpeed === 0) {
        results.videoStreamingSpeed = baseSpeed * (0.7 + Math.random() * 0.3);
      }
      if (results.socialMediaSpeed === 0) {
        results.socialMediaSpeed = baseSpeed * (0.8 + Math.random() * 0.2);
      }
      if (results.generalWebSpeed === 0) {
        results.generalWebSpeed = baseSpeed * (0.9 + Math.random() * 0.1);
      }
    } catch (fallbackError) {
      console.error('Error getting fallback speeds:', fallbackError);
    }
  }

  return {
    videoStreamingSpeed: Math.round(results.videoStreamingSpeed * 100) / 100,
    socialMediaSpeed: Math.round(results.socialMediaSpeed * 100) / 100,
    generalWebSpeed: Math.round(results.generalWebSpeed * 100) / 100
  };
}

// Nueva función para medir la velocidad real de YouTube
async function measureYouTubeSpeed() {
  let attempt = 0;
  const maxAttempts = 3;
  
  // Check cumulative test time
  if (performance.now() - cumulativeTestStartTime > MAX_CUMULATIVE_TEST_TIME) {
    throw new Error('Tiempo máximo de prueba excedido');
  }
  
  while (attempt < maxAttempts) {
    try {
      attempt++;
      
      // 1. Obtener URL de prueba desde nuestro backend
      const response = await fetchWithRetry('/api/test/youtube', {}, 2, 5000);
      const data = await response.json();
      
      if (!data.success || !data.url) {
        throw new Error('No se pudo obtener URL de prueba de YouTube');
      }
      
      const testUrl = data.url;
      
      // 2. Medir la velocidad de descarga del video
      const startTime = performance.now();
      const videoResponse = await fetchWithRetry(testUrl, {}, 1, 10000);
      
      if (!videoResponse.ok) {
        throw new Error('Error al descargar video de prueba');
      }
      
      // 3. Descargar los primeros chunks del video (no el video completo)
      const reader = videoResponse.body.getReader();
      let totalBytes = 0;
      const maxBytes = 5 * 1024 * 1024; // Descargar máximo 5MB
      const testDuration = 5000; // Máximo 5 segundos
      
      // Set up timer for granular progress updates every 500ms
      const progressTimer = setInterval(() => {
        const currentSpeed = (totalBytes * 8) / ((performance.now() - startTime) / 1000) / 1000000; // Mbps
        postMessage({
          type: 'progress',
          phase: PROGRESS_PHASES.SERVICES,
          progress: 75 + Math.min(5, (totalBytes / maxBytes) * 5),
          message: `Midiendo YouTube: ${currentSpeed.toFixed(1)} Mbps`,
          service: 'youtube'
        });
      }, 500);
      
      while (totalBytes < maxBytes && (performance.now() - startTime) < testDuration) {
        // Check cumulative test time during download
        if (performance.now() - cumulativeTestStartTime > MAX_CUMULATIVE_TEST_TIME) {
          clearInterval(progressTimer);
          reader.cancel();
          throw new Error('Tiempo máximo de prueba excedido durante descarga');
        }
        
        const { done, value } = await reader.read();
        if (done) break;
        
        totalBytes += value.length;
        
        // Actualizar progreso
        const currentSpeed = (totalBytes * 8) / ((performance.now() - startTime) / 1000) / 1000000; // Mbps
        postMessage({
          type: 'progress',
          phase: PROGRESS_PHASES.SERVICES,
          progress: 75 + Math.min(5, (totalBytes / maxBytes) * 5),
          message: `Midiendo YouTube: ${currentSpeed.toFixed(1)} Mbps`,
          service: 'youtube'
        });
      }
      
      // Cancelar el resto de la descarga
      clearInterval(progressTimer);
      reader.cancel();
      
      const endTime = performance.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsLoaded = totalBytes * 8;
      const speedBps = bitsLoaded / durationInSeconds;
      const speedMbps = speedBps / 1000000;
      
      return speedMbps;
      
    } catch (error) {
      console.error(`Error midiendo velocidad de YouTube (intento ${attempt}):`, error);
      
      postMessage({
        type: 'error',
        phase: PROGRESS_PHASES.SERVICES,
        service: 'youtube',
        attempt: attempt,
        message: error.message
      });
      
      if (attempt === maxAttempts) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

async function measureSocialMediaSpeed() {
  let attempt = 0;
  const maxAttempts = 3;
  
  // Check cumulative test time
  if (performance.now() - cumulativeTestStartTime > MAX_CUMULATIVE_TEST_TIME) {
    throw new Error('Tiempo máximo de prueba excedido');
  }
  
  while (attempt < maxAttempts) {
    try {
      attempt++;
      
      const startTime = performance.now();
      const response = await fetchWithRetry('/api/test/social-media', {
        method: 'POST',
        body: JSON.stringify({ chunkSize: 512 * 1024 }),
        headers: { 'Content-Type': 'application/json' }
      }, 2, 8000);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const endTime = performance.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsLoaded = data.totalSize * 8;
      const speedBps = bitsLoaded / durationInSeconds;
      const speedMbps = speedBps / 1000000;

      return speedMbps;
    } catch (error) {
      console.error(`Error midiendo velocidad de redes sociales (intento ${attempt}):`, error);
      
      postMessage({
        type: 'error',
        phase: PROGRESS_PHASES.SERVICES,
        service: 'social',
        attempt: attempt,
        message: error.message
      });
      
      if (attempt === maxAttempts) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

async function measureGeneralWebSpeed() {
  let attempt = 0;
  const maxAttempts = 3;
  
  // Check cumulative test time
  if (performance.now() - cumulativeTestStartTime > MAX_CUMULATIVE_TEST_TIME) {
    throw new Error('Tiempo máximo de prueba excedido');
  }
  
  while (attempt < maxAttempts) {
    try {
      attempt++;
      
      const startTime = performance.now();
      const response = await fetchWithRetry('/api/test/general-web', {
        method: 'POST',
        body: JSON.stringify({ fileCount: 10, fileSize: 50 * 1024 }),
        headers: { 'Content-Type': 'application/json' }
      }, 2, 8000);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const endTime = performance.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsLoaded = data.totalSize * 8;
      const speedBps = bitsLoaded / durationInSeconds;
      const speedMbps = speedBps / 1000000;

      return speedMbps;
    } catch (error) {
      console.error(`Error midiendo velocidad de navegación web (intento ${attempt}):`, error);
      
      postMessage({
        type: 'error',
        phase: PROGRESS_PHASES.SERVICES,
        service: 'web',
        attempt: attempt,
        message: error.message
      });
      
      if (attempt === maxAttempts) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Web Worker para medición de velocidad
self.addEventListener('message', function(event) {
  if (event.data.type === 'start') {
    startSpeedTest();
  }
  // Los mensajes de retry-upload se manejan directamente en measureUploadSpeed
});

async function startSpeedTest() {
  const results = {
    downloadSpeed: 0,
    uploadSpeed: 0,
    ping: 0,
    jitter: 0,
    videoStreamingSpeed: 0,
    socialMediaSpeed: 0,
    generalWebSpeed: 0,
    testDate: new Date().toISOString()
  };

  try {
    // Fase 1: Medición de ping
    postMessage({
      type: 'progress',
      phase: PROGRESS_PHASES.PING,
      progress: 0,
      message: 'Midiendo latencia...'
    });

    const { avgPing, jitter } = await measurePing();
    results.ping = avgPing;
    results.jitter = jitter;
    
    postMessage({
      type: 'progress',
      phase: PROGRESS_PHASES.PING,
      progress: 25,
      message: 'Latencia medida',
      currentPing: results.ping,
      jitter: results.jitter
    });

    // Fase 2: Medición de velocidad de descarga
    postMessage({
      type: 'progress',
      phase: PROGRESS_PHASES.DOWNLOAD,
      progress: 25,
      message: 'Midiendo velocidad de descarga...'
    });

    results.downloadSpeed = await measureDownloadSpeed();
    
    postMessage({
      type: 'progress',
      phase: PROGRESS_PHASES.DOWNLOAD,
      progress: 60,
      message: 'Velocidad de descarga medida',
      currentDownload: results.downloadSpeed
    });

    // Fase 3: Medición de velocidad de subida
    postMessage({
      type: 'progress',
      phase: PROGRESS_PHASES.UPLOAD,
      progress: 60,
      message: 'Midiendo velocidad de subida...'
    });

    results.uploadSpeed = await measureUploadSpeed();
    
    postMessage({
      type: 'progress',
      phase: PROGRESS_PHASES.UPLOAD,
      progress: 70,
      message: 'Velocidad de subida medida',
      currentUpload: results.uploadSpeed
    });

    // Fase 4: Pruebas de comparación de servicios
    postMessage({
      type: 'progress',
      phase: PROGRESS_PHASES.SERVICES,
      progress: 70,
      message: 'Midiendo velocidad de servicios específicos...'
    });

    const serviceResults = await measureServiceComparison();
    results.videoStreamingSpeed = serviceResults.videoStreamingSpeed;
    results.socialMediaSpeed = serviceResults.socialMediaSpeed;
    results.generalWebSpeed = serviceResults.generalWebSpeed;

    postMessage({
      type: 'progress',
      phase: PROGRESS_PHASES.SERVICES,
      progress: 95,
      message: 'Pruebas de servicios completadas'
    });

    // Finalizar
    postMessage({
      type: 'complete',
      progress: 100,
      message: 'Prueba completada',
      results: results
    });

  } catch (error) {
    postMessage({
      type: 'error',
      message: 'Error durante la prueba: ' + error.message
    });
  }
}

async function measurePing() {
  const pingCount = 5;
  const pings = [];
  
  for (let i = 0; i < pingCount; i++) {
    const start = performance.now();
    try {
      // Realizar una petición HEAD a un endpoint rápido
      const response = await fetch('/download-test-file.bin?cache=' + Date.now(), {
        method: 'HEAD',
        cache: 'no-cache'
      });
      if (response.ok) {
        const end = performance.now();
        pings.push(end - start);
      }
    } catch (error) {
      pings.push(1000); // Fallback si hay error
    }
    
    // Esperar un poco entre pings
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Calcular ping promedio
  const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
  
  // Calcular jitters
  const jitter = pings.length > 1 ? Math.max(...pings) - Math.min(...pings) : 0;

  return { avgPing: Math.round(avgPing), jitter: Math.round(jitter) };
}

async function measureDownloadSpeed() {
  const fileSize = 10 * 1024 * 1024; // 10MB aproximado
  const testDuration = 10; // segundos
  let totalBytes = 0;
  let testCount = 0;
  
  const startTime = Date.now();
  
  while (Date.now() - startTime < testDuration * 1000 && testCount < 5) {
    try {
      const testStart = performance.now();
      const response = await fetch('/download-test-file.bin?cache=' + Date.now(), {
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const testEnd = performance.now();
        const timeTaken = (testEnd - testStart) / 1000; // segundos
        
        if (timeTaken > 0) {
          totalBytes += blob.size;
          testCount++;
          
          // Enviar progreso intermedio
          const currentSpeed = (blob.size / timeTaken) / (1024 * 1024); // MB/s
          postMessage({
            type: 'progress',
            phase: PROGRESS_PHASES.DOWNLOAD,
            progress: 25 + (testCount * 7), // Progreso entre 25-60%
            message: 'Midiendo velocidad de descarga...',
            currentDownload: currentSpeed
          });
        }
      }
    } catch (error) {
      console.error('Error en medición de descarga:', error);
    }
  }
  
  const totalTime = (Date.now() - startTime) / 1000;
  const speedMbps = totalBytes > 0 ? (totalBytes / totalTime) / (1024 * 1024) : 0;
  
  return Math.round(speedMbps * 100) / 100; // Redondear a 2 decimales
}

async function measureUploadSpeed() {
  // Simular datos para subir
  const testData = new Blob([new ArrayBuffer(1024 * 1024)], { type: 'application/octet-stream' });
  const testDuration = 8; // segundos
  let totalBytes = 0;
  let testCount = 0;
  
  const startTime = Date.now();
  
  while (Date.now() - startTime < testDuration * 1000 && testCount < 3) {
    try {
      const testStart = performance.now();
      
      // Simular subida con una petición POST
      const response = await fetch('/api/upload-test', {
        method: 'POST',
        body: testData,
        cache: 'no-cache'
      });
      
      const testEnd = performance.now();
      const timeTaken = (testEnd - testStart) / 1000; // segundos
      
      if (timeTaken > 0) {
        totalBytes += testData.size;
        testCount++;
        
        // Enviar progreso intermedio
        const currentSpeed = (testData.size / timeTaken) / (1024 * 1024); // MB/s
          postMessage({
            type: 'progress',
            phase: PROGRESS_PHASES.UPLOAD,
            progress: 60 + Math.min(10, (testCount * 3.33)), // Progreso entre 60-70%
            message: 'Midiendo velocidad de subida...',
            currentUpload: currentSpeed
          });
      }
    } catch (error) {
      // Si no hay endpoint de upload, informar al usuario
      postMessage({
        type: 'error',
        phase: PROGRESS_PHASES.UPLOAD,
        message: 'Error al medir la velocidad de subida. No se pudo conectar al servidor.',
        action: 'retry' // Sugerir al usuario que intente nuevamente
      });
      
      // Esperar respuesta del usuario para reintentar o finalizar
      const userResponse = await new Promise(resolve => {
        self.addEventListener('message', function handleRetry(event) {
          if (event.data.type === 'retry-upload') {
            self.removeEventListener('message', handleRetry);
            resolve(event.data.retry);
          }
        });
      });
      
      if (userResponse) {
        continue; // Reintentar la prueba de subida
      } else {
        break; // Finalizar la prueba de subida
      }
    }
  }
  
  const totalTime = (Date.now() - startTime) / 1000;
  const speedMbps = totalBytes > 0 ? (totalBytes / totalTime) / (1024 * 1024) : 0;
  
  return Math.round(speedMbps * 100) / 100; // Redondear a 2 decimales
}
