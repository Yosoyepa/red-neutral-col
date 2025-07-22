"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  Shield,
  Download,
  Upload,
  Zap,
  CheckCircle,
  AlertTriangle,
  Share2,
  Map,
  BarChart3,
  TrendingUp,
  Home,
  Globe,
  Activity,
  Info,
} from "lucide-react"
import ServiceSpeedChart from "@/components/ui/ServiceSpeedChart"
import ComparisonRadarChart from "@/components/ui/ComparisonRadarChart"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Definimos un tipo para los datos que el componente espera recibir
type TestResult = {
  id: string;
  isp: string;
  city: string;
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
  testDate: Date;
};

// Definimos un tipo para los promedios
type Averages = {
  download: number;
  upload: number;
  latency: number;
};

// Definimos un tipo para los datos de comparación de servicios
type ServiceComparison = {
  videoStreamingSpeed: number;
  socialMediaSpeed: number;
  generalWebSpeed: number;
};

// El componente ahora recibe los resultados como una prop 'initialResults' y los promedios, puntaje y estado de neutralidad
export function ResultsScreen({ 
  initialResults, 
  cityAverages, 
  ispAverages, 
  neutralityScore, 
  neutralityStatus,
  serviceComparison
}: { 
  initialResults: TestResult; 
  cityAverages: Averages;
  ispAverages: Averages;
  neutralityScore: number;
  neutralityStatus: string;
  serviceComparison: ServiceComparison;
}) {
  const [throttlingModalOpen, setThrottlingModalOpen] = useState(false)
  
  // Usar los datos reales de la base de datos
  const results = {
    download: initialResults.downloadSpeed,
    upload: initialResults.uploadSpeed,
    latency: initialResults.ping,
    isp: initialResults.isp,
    city: initialResults.city,
    jitter: initialResults.jitter,
    testDate: initialResults.testDate,
neutralityStatus,
neutralityScore
  }

  // Usar los promedios reales calculados desde la base de datos
  const cityAverage = cityAverages;
  const ispAverage = ispAverages;

  const { videoStreamingSpeed, socialMediaSpeed, generalWebSpeed } = serviceComparison;

  const throttlingDetected = Math.max(videoStreamingSpeed, socialMediaSpeed, generalWebSpeed) >= 1.2 * Math.min(videoStreamingSpeed, socialMediaSpeed, generalWebSpeed);

  const getNeutralityStatus = () => {
    // Manejar el caso cuando no hay datos suficientes
    if (results.neutralityStatus === 'insufficient-data') {
      return {
        status: "Datos insuficientes para el análisis",
        description: "No hay suficientes datos de comparación para tu ISP o ciudad. Sé el primero en contribuir.",
        color: "text-gray-700",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        icon: AlertTriangle,
        iconColor: "text-gray-600",
      }
    }
    
    if (results.neutralityScore >= 85) {
      return {
        status: "No detectamos anomalías significativas",
        description: "Tu conexión parece respetar los principios de neutralidad de la red.",
        color: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: CheckCircle,
        iconColor: "text-green-600",
      }
    } else if (results.neutralityScore >= 70) {
      return {
        status: "Detectamos una posible priorización de tráfico",
        description: "Algunos servicios podrían tener velocidades diferentes. Te recomendamos hacer más pruebas.",
        color: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        icon: AlertTriangle,
        iconColor: "text-amber-600",
      }
    } else {
      return {
        status: "Detectamos posibles violaciones a la neutralidad",
        description: "Hay diferencias significativas en las velocidades entre servicios.",
        color: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: AlertTriangle,
        iconColor: "text-red-600",
      }
    }
  }

  const neutralityInfo = getNeutralityStatus()
  const NeutralityIcon = neutralityInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Red Neutral</span>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Home className="w-4 h-4" />
                Nueva Prueba
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Resultados de tu Prueba</h1>
            <p className="text-slate-600">
              {results.isp} • {results.city} • {results.testDate.toLocaleDateString("es-CO")}
            </p>
          </div>

          {/* Main Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Download className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-3xl font-bold text-slate-900">{results.download}</div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="hover:bg-slate-100 rounded-full p-1">
                            <Info className="w-4 h-4 text-slate-400" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium text-slate-900">Velocidad de Descarga</h4>
                            <p className="text-sm text-slate-600">
                              <strong>¿Cómo se mide?</strong> Descargamos chunks de 5 MB durante máximo 5 segundos y calculamos la velocidad promedio.
                            </p>
                            <p className="text-sm text-slate-600">
                              <strong>¿Qué valores esperar?</strong> Para uso básico: &gt;10 Mbps, para streaming HD: &gt;25 Mbps, para 4K: &gt;50 Mbps.
                            </p>
                            <p className="text-sm text-slate-600">
                              <strong>¿Qué indica un valor bajo?</strong> Puede indicar congestión de red, limitaciones del ISP o problemas en tu conexión.
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="text-sm text-slate-600">Mbps Descarga</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">vs. Promedio ciudad</span>
                    <span className={results.download > cityAverage.download ? "text-green-600" : "text-red-600"}>
                      {cityAverage.download > 0 ? (
                        <>
                          {results.download > cityAverage.download ? "+" : ""}
                          {(((results.download - cityAverage.download) / cityAverage.download) * 100).toFixed(1)}%
                        </>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                  <Progress value={cityAverage.download > 0 ? (results.download / cityAverage.download) * 50 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-3xl font-bold text-slate-900">{results.upload}</div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="hover:bg-slate-100 rounded-full p-1">
                            <Info className="w-4 h-4 text-slate-400" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium text-slate-900">Velocidad de Subida</h4>
                            <p className="text-sm text-slate-600">
                              <strong>¿Cómo se mide?</strong> Enviamos chunks de datos de 5 MB durante máximo 5 segundos al servidor.
                            </p>
                            <p className="text-sm text-slate-600">
                              <strong>¿Qué valores esperar?</strong> Para videollamadas: &gt;3 Mbps, para streaming en vivo: &gt;10 Mbps, para backup de archivos: &gt;20 Mbps.
                            </p>
                            <p className="text-sm text-slate-600">
                              <strong>¿Qué indica un valor bajo?</strong> Puede afectar videollamadas, subida de archivos y streaming en vivo. Los ISP suelen asignar menos ancho de banda a la subida.
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="text-sm text-slate-600">Mbps Subida</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">vs. Promedio ISP</span>
                    <span className={results.upload > ispAverage.upload ? "text-green-600" : "text-red-600"}>
                      {ispAverage.upload > 0 ? (
                        <>
                          {results.upload > ispAverage.upload ? "+" : ""}
                          {(((results.upload - ispAverage.upload) / ispAverage.upload) * 100).toFixed(1)}%
                        </>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                  <Progress value={ispAverage.upload > 0 ? (results.upload / ispAverage.upload) * 50 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-3xl font-bold text-slate-900">{results.latency}</div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="hover:bg-slate-100 rounded-full p-1">
                            <Info className="w-4 h-4 text-slate-400" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium text-slate-900">Latencia (Ping)</h4>
                            <p className="text-sm text-slate-600">
                              <strong>¿Cómo se mide?</strong> Enviamos paquetes pequeños al servidor y medimos el tiempo de ida y vuelta (RTT).
                            </p>
                            <p className="text-sm text-slate-600">
                              <strong>¿Qué valores esperar?</strong> Para gaming: &lt;20 ms excelente, &lt;50 ms bueno. Para navegación: &lt;100 ms aceptable.
                            </p>
                            <p className="text-sm text-slate-600">
                              <strong>¿Qué indica un valor alto?</strong> Puede causar retrasos en videollamadas, lag en juegos y lentitud al navegar. Depende de la distancia al servidor y calidad de la conexión.
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="text-sm text-slate-600">ms Latencia</div>
                  </div>
                </div>
                <div className="mt-4">
                  <Badge
                    variant={results.latency < 20 ? "default" : results.latency < 50 ? "secondary" : "destructive"}
                  >
                    {results.latency < 20 ? "Excelente" : results.latency < 50 ? "Buena" : "Mejorable"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Neutrality Analysis */}
          <Card className={`shadow-lg border-2 ${neutralityInfo.borderColor} ${neutralityInfo.bgColor} mb-8`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <NeutralityIcon className={`w-6 h-6 ${neutralityInfo.iconColor}`} />
                Análisis de Neutralidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${neutralityInfo.color}`}>{neutralityInfo.status}</h3>
                  <p className="text-slate-600 mb-4">{neutralityInfo.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Puntuación de Neutralidad:</span>
                    <Badge variant="outline" className="font-bold">
                      {results.neutralityScore}/100
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Comparación de Servicios</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Video Streaming</span>
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium">{videoStreamingSpeed} Mbps</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Redes Sociales</span>
                    <div className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">{socialMediaSpeed} Mbps</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Navegación Web</span>
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">{generalWebSpeed} Mbps</span>
                    </div>
                  </div>
                </div>

                {throttlingDetected && (
                  <div className="mt-4">
                    <Badge variant="destructive" className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Throttling Detectado</span>
                    </Badge>
                  </div>
                )}
                  <div className="mt-3">
                    <button
                      onClick={() => setThrottlingModalOpen(true)}
                      className="text-xs text-blue-600 hover:text-blue-700 underline"
                    >
                      ¿Qué es el throttling?
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Performance Section */}
          <Card className="shadow-lg border-0 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Rendimiento por servicio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Velocidad por tipo de servicio</h4>
                  <ServiceSpeedChart serviceComparison={serviceComparison} />
                  {throttlingDetected && (
                    <p className="text-xs text-red-600 mt-2">
                      ⚠️ Detectamos diferencias significativas entre servicios
                    </p>
                  )}
                </div>
                
                {(cityAverages.download > 0 || ispAverages.download > 0) && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Comparación general</h4>
                    <ComparisonRadarChart 
                      userResults={results}
                      cityAverages={cityAverages}
                      ispAverages={ispAverages}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Comparison Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Comparación con tu Ciudad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Descarga</span>
                      <span>
                        {results.download} / {cityAverage.download.toFixed(1)} Mbps
                      </span>
                    </div>
                    <Progress value={cityAverage.download > 0 ? (results.download / (cityAverage.download * 1.5)) * 100 : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subida</span>
                      <span>
                        {results.upload} / {cityAverage.upload.toFixed(1)} Mbps
                      </span>
                    </div>
                    <Progress value={cityAverage.upload > 0 ? (results.upload / (cityAverage.upload * 1.5)) * 100 : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Latencia</span>
                      <span>
                        {results.latency} / {cityAverage.latency.toFixed(0)} ms
                      </span>
                    </div>
                    <Progress value={cityAverage.latency > 0 ? 100 - (results.latency / cityAverage.latency) * 50 : 0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Comparación con tu ISP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Descarga</span>
                      <span>
                        {results.download} / {ispAverage.download.toFixed(1)} Mbps
                      </span>
                    </div>
                    <Progress value={ispAverage.download > 0 ? (results.download / (ispAverage.download * 1.5)) * 100 : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subida</span>
                      <span>
                        {results.upload} / {ispAverage.upload.toFixed(1)} Mbps
                      </span>
                    </div>
                    <Progress value={ispAverage.upload > 0 ? (results.upload / (ispAverage.upload * 1.5)) * 100 : 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Latencia</span>
                      <span>
                        {results.latency} / {ispAverage.latency.toFixed(0)} ms
                      </span>
                    </div>
                    <Progress value={ispAverage.latency > 0 ? 100 - (results.latency / ispAverage.latency) * 50 : 0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Share2 className="w-4 h-4" />
              Compartir Resultados (Anónimamente)
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Map className="w-4 h-4" />
              Ver Mapa Nacional
            </Button>
          </div>
        </div>
      </div>
      
      {/* Throttling Explanation Dialog */}
      <Dialog open={throttlingModalOpen} onOpenChange={setThrottlingModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">¿Qué es el throttling?</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <p className="text-base leading-relaxed">
              El <strong>throttling</strong> (o estrangulamiento de banda ancha) es una práctica mediante la cual los proveedores de servicios de internet (ISP) reducen intencionalmente la velocidad de tu conexión para ciertos servicios o sitios web específicos.
            </p>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">¿Cómo funciona?</h3>
            <p className="text-sm mb-3">
              Los ISP pueden identificar el tipo de tráfico que estás usando (video streaming, redes sociales, navegación web, etc.) y limitar selectivamente la velocidad de ciertos servicios. Por ejemplo:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Video Streaming</strong>: Tu ISP podría limitar Netflix o YouTube a velocidades más bajas</li>
              <li><strong>Redes Sociales</strong>: Reducir la velocidad de Instagram o TikTok</li>
              <li><strong>Navegación General</strong>: Mantener velocidades normales para sitios web regulares</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">¿Por qué lo hacen los ISP?</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li><strong>Gestión de red</strong>: Para reducir la congestión durante horas pico</li>
              <li><strong>Modelos de negocio</strong>: Para favorecer sus propios servicios o socios</li>
              <li><strong>Planes escalonados</strong>: Para incentivar la compra de planes más costosos</li>
            </ol>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">¿Cómo viola la neutralidad de la red?</h3>
            <p className="text-sm mb-3">
              La neutralidad de la red establece que todo el tráfico de internet debe ser tratado por igual. El throttling selectivo viola este principio porque:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Discrimina entre diferentes tipos de contenido</li>
              <li>Crea "carriles rápidos" y "carriles lentos" en internet</li>
              <li>Limita tu libertad de acceder al contenido que elijas</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">¿Cómo detectamos el throttling?</h3>
            <p className="text-sm mb-3">
              Nuestra herramienta mide la velocidad de diferentes tipos de servicios:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li><strong>Velocidad general</strong>: Tu velocidad máxima de descarga</li>
              <li><strong>Video streaming</strong>: Velocidad al acceder a servicios de video</li>
              <li><strong>Redes sociales</strong>: Velocidad en plataformas sociales</li>
              <li><strong>Navegación web</strong>: Velocidad en sitios web generales</li>
            </ol>
            <p className="text-sm mt-3">
              Si detectamos diferencias significativas (&gt;20%) entre estos servicios, es probable que tu ISP esté aplicando throttling.
            </p>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">¿Qué puedes hacer?</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Documenta</strong>: Guarda los resultados de tus pruebas</li>
              <li><strong>Reporta</strong>: Informa a las autoridades regulatorias</li>
              <li><strong>Comparte</strong>: Ayuda a otros usuarios a conocer estas prácticas</li>
              <li><strong>Cambia</strong>: Considera cambiar a un ISP que respete la neutralidad de la red</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
