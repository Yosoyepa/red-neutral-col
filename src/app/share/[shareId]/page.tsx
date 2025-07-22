'use client'

import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Upload, Clock, Activity, Share2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

async function getSharedResult(shareId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/share-result?shareId=${shareId}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching shared result:', error);
    return null;
  }
}

export default function SharedResultPage({ 
  params 
}: { 
  params: { shareId: string } 
}) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  
  useEffect(() => {
    async function fetchResult() {
      const data = await getSharedResult(params.shareId);
      if (!data) {
        notFound();
      }
      setResult(data);
      setLoading(false);
    }
    fetchResult();
  }, [params.shareId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando resultado...</div>
      </div>
    );
  }
  
  if (!result) {
    return null;
  }

  const testDate = new Date(result.testDate);
  const formattedDate = testDate.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Determinar si hay throttling significativo
  const hasThrottling = result.throttlingRatio && result.throttlingRatio < 0.8;
  const throttlingPercentage = result.throttlingRatio ? Math.round((1 - result.throttlingRatio) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Resultado de Prueba de Neutralidad</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Red Neutral COL - Monitoreo de Neutralidad de Red en Colombia
          </p>
          <Badge variant="secondary" className="mt-2">
            ID: {params.shareId}
          </Badge>
        </div>

        {/* Alerta de throttling si existe */}
        {hasThrottling && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">
                  Posible throttling detectado: {throttlingPercentage}% de reducción en velocidad
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información principal */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Velocidad de Descarga</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{result.downloadSpeed.toFixed(2)} Mbps</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Velocidad de Subida</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{result.uploadSpeed.toFixed(2)} Mbps</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latencia (Ping)</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{result.ping} ms</div>
            </CardContent>
          </Card>
        </div>

        {/* Detalles adicionales */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalles de la Prueba</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Proveedor de Internet</p>
                <p className="font-semibold">{result.isp}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ciudad</p>
                <p className="font-semibold">{result.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Jitter</p>
                <p className="font-semibold">{result.jitter.toFixed(2)} ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Prueba</p>
                <p className="font-semibold">{formattedDate}</p>
              </div>
            </div>

            {/* Resultados por servicio si existen */}
            {(result.videoStreamingSpeed || result.socialMediaSpeed || result.generalWebSpeed) && (
              <>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Velocidad por Tipo de Servicio</h4>
                  <div className="space-y-2">
                    {result.videoStreamingSpeed && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Streaming de Video</span>
                        <span className="font-medium">{result.videoStreamingSpeed.toFixed(2)} Mbps</span>
                      </div>
                    )}
                    {result.socialMediaSpeed && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Redes Sociales</span>
                        <span className="font-medium">{result.socialMediaSpeed.toFixed(2)} Mbps</span>
                      </div>
                    )}
                    {result.generalWebSpeed && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Navegación General</span>
                        <span className="font-medium">{result.generalWebSpeed.toFixed(2)} Mbps</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold">¿Quieres probar tu conexión?</p>
              <p className="text-gray-600 dark:text-gray-400">
                Realiza tu propia prueba de neutralidad de red y descubre si tu ISP está limitando tu conexión.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button size="lg">
                    <Activity className="mr-2 h-4 w-4" />
                    Hacer mi Prueba
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={async () => {
                    await navigator.clipboard.writeText(window.location.href);
                    setShowCopySuccess(true);
                    setTimeout(() => setShowCopySuccess(false), 3000);
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {showCopySuccess ? '¡Copiado!' : 'Copiar Enlace'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Este resultado fue generado por Red Neutral COL, una herramienta para monitorear
            la neutralidad de red en Colombia.
          </p>
        </div>
      </div>
    </div>
  );
}
