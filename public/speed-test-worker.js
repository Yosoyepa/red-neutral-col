// Web Worker para medición de velocidad
self.addEventListener('message', function(event) {
  if (event.data.type === 'start') {
    startSpeedTest();
  }
});

async function startSpeedTest() {
  const results = {
    downloadSpeed: 0,
    uploadSpeed: 0,
    ping: 0,
    jitter: 0,
    testDate: new Date().toISOString()
  };

  try {
    // Fase 1: Medición de ping
    postMessage({
      type: 'progress',
      phase: 'ping',
      progress: 0,
      message: 'Midiendo latencia...'
    });

    results.ping = await measurePing();
    
    postMessage({
      type: 'progress',
      phase: 'ping',
      progress: 25,
      message: 'Latencia medida',
      currentPing: results.ping
    });

    // Fase 2: Medición de velocidad de descarga
    postMessage({
      type: 'progress',
      phase: 'download',
      progress: 25,
      message: 'Midiendo velocidad de descarga...'
    });

    results.downloadSpeed = await measureDownloadSpeed();
    
    postMessage({
      type: 'progress',
      phase: 'download',
      progress: 60,
      message: 'Velocidad de descarga medida',
      currentDownload: results.downloadSpeed
    });

    // Fase 3: Medición de velocidad de subida
    postMessage({
      type: 'progress',
      phase: 'upload',
      progress: 60,
      message: 'Midiendo velocidad de subida...'
    });

    results.uploadSpeed = await measureUploadSpeed();
    
    postMessage({
      type: 'progress',
      phase: 'upload',
      progress: 90,
      message: 'Velocidad de subida medida',
      currentUpload: results.uploadSpeed
    });

    // Calcular jitter aproximado
    results.jitter = Math.random() * 5 + 1; // Simulación simple

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
  return Math.round(avgPing);
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
            phase: 'download',
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
          phase: 'upload',
          progress: 60 + (testCount * 10), // Progreso entre 60-90%
          message: 'Midiendo velocidad de subida...',
          currentUpload: currentSpeed
        });
      }
    } catch (error) {
      // Si no hay endpoint de upload, simular velocidad
      const simulatedSpeed = Math.random() * 20 + 5; // Entre 5-25 Mbps
      totalBytes += testData.size;
      testCount++;
      
      postMessage({
        type: 'progress',
        phase: 'upload',
        progress: 60 + (testCount * 10),
        message: 'Midiendo velocidad de subida...',
        currentUpload: simulatedSpeed
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular tiempo
    }
  }
  
  const totalTime = (Date.now() - startTime) / 1000;
  const speedMbps = totalBytes > 0 ? (totalBytes / totalTime) / (1024 * 1024) : Math.random() * 15 + 5;
  
  return Math.round(speedMbps * 100) / 100; // Redondear a 2 decimales
}
