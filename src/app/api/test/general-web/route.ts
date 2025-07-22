import { NextRequest, NextResponse } from 'next/server';

// Patrones típicos de navegación web
const GENERAL_WEB_PATTERNS = {
  // Tipos de contenido y sus tamaños típicos
  contentTypes: {
    'html': { min: 10 * 1024, max: 100 * 1024 },     // 10-100KB
    'css': { min: 5 * 1024, max: 50 * 1024 },        // 5-50KB
    'js': { min: 20 * 1024, max: 200 * 1024 },       // 20-200KB
    'image': { min: 5 * 1024, max: 150 * 1024 }      // 5-150KB
  },
  // Composición típica de un sitio web
  pageComposition: [
    { type: 'html', count: 1 },
    { type: 'css', count: 3 },
    { type: 'js', count: 5 },
    { type: 'image', count: 10 }
  ],
  // Latencias típicas por tipo de servidor
  serverLatency: {
    'local': { min: 5, max: 20 },
    'regional': { min: 30, max: 70 },
    'global': { min: 70, max: 200 }
  }
};

// Simular descarga de un sitio completo
export async function POST(req: NextRequest) {
  try {
    const { 
      siteType = 'blog', // blog, e-commerce, news, portfolio
      simulate = true
    } = await req.json();
    
    // Generar contenido del sitio basado en el tipo
    const siteItems = [];
    let totalSize = 0;
    
    // Generar items del sitio según el tipo
    for (const item of GENERAL_WEB_PATTERNS.pageComposition) {
      for (let i = 0; i < item.count; i++) {
        const size = getRandomSize(item.type);
        const latency = getRandomLatency();
        
        siteItems.push({
          id: `item_${i}_${item.type}`,
          type: item.type,
          size: size,
          latency: latency,
          timestamp: new Date().toISOString()
        });
        
        totalSize += size;
      }
    }
    
    // Simular la descarga progresiva del sitio
    const contentData = new Uint8Array(totalSize);
    let offset = 0;
    
    // Llenar con datos que simulen diferentes tipos de contenido
    for (const item of siteItems) {
      for (let i = 0; i < item.size; i++) {
        if (item.type === 'html') {
          // Datos HTML simulados
          contentData[offset + i] = i < 2 ? 0x3C : (i < 4 ? 0x68 : Math.floor(Math.random() * 256));
        } else if (item.type === 'css') {
          // Datos CSS simulados
          contentData[offset + i] = i < 2 ? 0x7B : (i < 4 ? 0x20 : Math.floor(Math.random() * 256));
        } else if (item.type === 'js') {
          // Datos JS simulados
          contentData[offset + i] = i < 2 ? 0x66 : (i < 4 ? 0x75 : Math.floor(Math.random() * 256));
        } else {
          // Datos de imagen simulados
          contentData[offset + i] = Math.floor(Math.random() * 256);
        }
      }
      offset += item.size;
    }
    
    // Simular latencia del servidor
    const avgLatency = siteItems.reduce((sum, item) => sum + item.latency, 0) / siteItems.length;
    await new Promise(resolve => setTimeout(resolve, avgLatency));
    
    return new NextResponse(contentData, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': totalSize.toString(),
        'Cache-Control': 'no-cache',
        'X-Site-Type': siteType,
        'X-Total-Size': totalSize.toString(),
        'X-Average-Latency': avgLatency.toFixed(2),
        'X-Site-Items': JSON.stringify(siteItems.map(item => ({ type: item.type, size: item.size })))
      },
    });
  } catch (error) {
    console.error('Error en prueba de navegación web:', error);
    return NextResponse.json(
      { success: false, message: 'Error al generar contenido de prueba' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    service: 'general-web',
    description: 'Endpoint para simular navegación web general',
    patterns: GENERAL_WEB_PATTERNS,
    siteTypes: ['blog', 'e-commerce', 'news', 'portfolio'],
    note: 'Simula patrones de carga típicos de sitios web comunes.'
  });
}

// Funciones auxiliares
function getRandomSize(contentType: string): number {
  const range = GENERAL_WEB_PATTERNS.contentTypes[contentType] || { min: 5 * 1024, max: 200 * 1024 };
  return Math.floor(range.min + Math.random() * (range.max - range.min));
}

function getRandomLatency(): number {
  // 50% local, 40% regional, 10% global
  const rand = Math.random();
  const region = rand < 0.5 ? 'local' : rand < 0.9 ? 'regional' : 'global';
  const range = GENERAL_WEB_PATTERNS.serverLatency[region];
  return range.min + Math.random() * (range.max - range.min);
}
