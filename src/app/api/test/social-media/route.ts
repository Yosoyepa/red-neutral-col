import { NextRequest, NextResponse } from 'next/server';

// Patrones típicos de contenido en redes sociales
const SOCIAL_MEDIA_PATTERNS = {
  // Tipos de contenido y sus tamaños típicos
  contentTypes: {
    'profile-image': { min: 50 * 1024, max: 200 * 1024 },        // 50-200KB
    'feed-image': { min: 200 * 1024, max: 800 * 1024 },          // 200-800KB
    'story-image': { min: 100 * 1024, max: 500 * 1024 },         // 100-500KB
    'thumbnail': { min: 10 * 1024, max: 50 * 1024 },             // 10-50KB
    'video-preview': { min: 500 * 1024, max: 2 * 1024 * 1024 },  // 500KB-2MB
    'text-post': { min: 1 * 1024, max: 5 * 1024 },               // 1-5KB
    'comments': { min: 2 * 1024, max: 20 * 1024 }                // 2-20KB
  },
  // Simulación de un feed típico
  feedComposition: [
    { type: 'feed-image', count: 5 },
    { type: 'profile-image', count: 8 },
    { type: 'thumbnail', count: 15 },
    { type: 'text-post', count: 10 },
    { type: 'video-preview', count: 2 },
    { type: 'comments', count: 20 }
  ],
  // Latencias típicas por región de CDN
  cdnLatency: {
    'local': { min: 5, max: 15 },
    'regional': { min: 20, max: 50 },
    'global': { min: 50, max: 150 }
  }
};

// Simular descarga de un feed completo de red social
export async function POST(req: NextRequest) {
  try {
    const { 
      feedType = 'home', // home, stories, explore, reels
      itemCount = 10,
      simulate = true
    } = await req.json();
    
    // Generar contenido del feed basado en el tipo
    const feedItems = [];
    let totalSize = 0;
    
    // Generar items del feed según el tipo
    for (let i = 0; i < itemCount; i++) {
      const contentType = getContentTypeForFeed(feedType);
      const size = getRandomSize(contentType);
      const latency = getRandomLatency();
      
      feedItems.push({
        id: `item_${i}`,
        type: contentType,
        size: size,
        latency: latency,
        timestamp: new Date().toISOString()
      });
      
      totalSize += size;
    }
    
    // Simular la descarga progresiva del feed
    const contentData = new Uint8Array(totalSize);
    let offset = 0;
    
    // Llenar con datos que simulen diferentes tipos de contenido
    for (const item of feedItems) {
      for (let i = 0; i < item.size; i++) {
        if (item.type.includes('image')) {
          // Datos de imagen JPEG simulados
          contentData[offset + i] = i < 2 ? 0xFF : (i < 4 ? 0xD8 : Math.floor(Math.random() * 256));
        } else if (item.type.includes('video')) {
          // Datos de video MP4 simulados
          contentData[offset + i] = i < 4 ? [0x00, 0x00, 0x00, 0x20][i] : Math.floor(Math.random() * 256);
        } else {
          // Datos de texto/JSON
          contentData[offset + i] = 32 + Math.floor(Math.random() * 95); // Caracteres ASCII imprimibles
        }
      }
      offset += item.size;
    }
    
    // Simular latencia de CDN de red social
    const avgLatency = feedItems.reduce((sum, item) => sum + item.latency, 0) / feedItems.length;
    await new Promise(resolve => setTimeout(resolve, avgLatency));
    
    return new NextResponse(contentData, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': totalSize.toString(),
        'Cache-Control': 'no-cache',
        'X-Feed-Type': feedType,
        'X-Item-Count': itemCount.toString(),
        'X-Total-Size': totalSize.toString(),
        'X-Average-Latency': avgLatency.toFixed(2),
        'X-Feed-Items': JSON.stringify(feedItems.map(item => ({ type: item.type, size: item.size })))
      },
    });
  } catch (error) {
    console.error('Error en prueba de redes sociales:', error);
    return NextResponse.json(
      { success: false, message: 'Error al generar contenido de prueba' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    service: 'social-media',
    description: 'Endpoint para simular descarga de contenido de redes sociales',
    patterns: SOCIAL_MEDIA_PATTERNS,
    feedTypes: ['home', 'stories', 'explore', 'reels'],
    note: 'Simula patrones de carga típicos de Instagram, Facebook, Twitter, etc.'
  });
}

// Funciones auxiliares
function getContentTypeForFeed(feedType: string): string {
  const typeDistribution = {
    'home': ['feed-image', 'text-post', 'video-preview', 'profile-image'],
    'stories': ['story-image', 'video-preview'],
    'explore': ['feed-image', 'thumbnail', 'video-preview'],
    'reels': ['video-preview', 'thumbnail']
  };
  
  const types = typeDistribution[feedType] || typeDistribution['home'];
  return types[Math.floor(Math.random() * types.length)];
}

function getRandomSize(contentType: string): number {
  const range = SOCIAL_MEDIA_PATTERNS.contentTypes[contentType] || { min: 10 * 1024, max: 100 * 1024 };
  return Math.floor(range.min + Math.random() * (range.max - range.min));
}

function getRandomLatency(): number {
  // 70% local, 25% regional, 5% global
  const rand = Math.random();
  const region = rand < 0.7 ? 'local' : rand < 0.95 ? 'regional' : 'global';
  const range = SOCIAL_MEDIA_PATTERNS.cdnLatency[region];
  return range.min + Math.random() * (range.max - range.min);
}
