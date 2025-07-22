import { NextRequest, NextResponse } from 'next/server';

// URLs de videos de prueba con diferentes calidades (Creative Commons)
const TEST_VIDEOS = {
  '1080p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  '480p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
};

// Simulación de patrones de tráfico de video streaming
const VIDEO_PATTERNS = {
  // YouTube típicamente usa chunks de 2-10MB
  chunkSizes: [2 * 1024 * 1024, 5 * 1024 * 1024, 10 * 1024 * 1024],
  // Bitrates típicos para diferentes calidades (en Mbps)
  bitrates: {
    '4K': 25,
    '1080p': 8,
    '720p': 5,
    '480p': 2.5,
    '360p': 1
  }
};

export async function GET(req: NextRequest) {
  try {
    // En una implementación real, aquí se obtendría la URL del video de YouTube
    // usando youtube-stream-url o similar. Por ahora, usamos videos de prueba.
    
    return NextResponse.json({
      success: true,
      urls: TEST_VIDEOS,
      service: 'youtube',
      patterns: VIDEO_PATTERNS,
      note: 'Videos de prueba con licencia Creative Commons',
      recommendedTest: {
        url: TEST_VIDEOS['720p'],
        quality: '720p',
        expectedBitrate: VIDEO_PATTERNS.bitrates['720p']
      }
    });
  } catch (error) {
    console.error('Error al obtener URL de prueba:', error);
    return NextResponse.json(
      { success: false, message: 'No se pudo obtener la URL de prueba' },
      { status: 500 }
    );
  }
}

// Endpoint para simular streaming de video con chunks adaptativos
export async function POST(req: NextRequest) {
  try {
    const { 
      quality = '720p',
      chunkIndex = 0,
      simulate = true // Si es true, genera datos sintéticos; si es false, intenta proxy real
    } = await req.json();
    
    // Seleccionar tamaño de chunk basado en la calidad
    const chunkSize = quality === '1080p' ? VIDEO_PATTERNS.chunkSizes[2] : 
                     quality === '720p' ? VIDEO_PATTERNS.chunkSizes[1] : 
                     VIDEO_PATTERNS.chunkSizes[0];
    
    // Simular características de video streaming
    const videoData = new Uint8Array(chunkSize);
    
    // Generar datos que simulen un patrón de video comprimido
    // Los videos reales tienen patrones específicos en sus datos
    for (let i = 0; i < videoData.length; i++) {
      // Simular frames I, P, B con diferentes tamaños
      if (i % 1000 < 100) {
        // I-frame (más datos)
        videoData[i] = 200 + Math.floor(Math.random() * 56);
      } else if (i % 1000 < 400) {
        // P-frame (datos medios)
        videoData[i] = 100 + Math.floor(Math.random() * 100);
      } else {
        // B-frame (menos datos)
        videoData[i] = Math.floor(Math.random() * 100);
      }
    }
    
    // Simular latencia de CDN (YouTube usa Google CDN)
    const cdnLatency = 10 + Math.random() * 20; // 10-30ms
    await new Promise(resolve => setTimeout(resolve, cdnLatency));
    
    return new NextResponse(videoData, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': chunkSize.toString(),
        'Cache-Control': 'no-cache',
        'X-Content-Duration': '10', // Duración del chunk en segundos
        'X-Chunk-Index': chunkIndex.toString(),
        'X-Video-Quality': quality,
        'X-CDN-Server': 'youtube-test-cdn',
        'X-Bitrate-Kbps': (VIDEO_PATTERNS.bitrates[quality] * 1000).toString()
      },
    });
  } catch (error) {
    console.error('Error en prueba de video streaming:', error);
    return NextResponse.json(
      { success: false, message: 'Error al generar chunk de video' },
      { status: 500 }
    );
  }
}
