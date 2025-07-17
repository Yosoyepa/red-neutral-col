import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"
import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import Link from "next/link"

const prisma = new PrismaClient()

type Props = {
  params: { id: string }
}

export default async function ResultsScreen({ params }: Props) {
  // Buscar el resultado en la base de datos
  const testResult = await prisma.testResult.findUnique({
    where: { id: params.id }
  })
  
  if (!testResult) {
    notFound()
  }
  
  // Usar los datos reales de la base de datos
  const results = {
    download: testResult.downloadSpeed,
    upload: testResult.uploadSpeed,
    latency: testResult.ping,
    isp: testResult.isp,
    city: testResult.city,
    jitter: testResult.jitter,
    testDate: testResult.testDate,
    neutralityStatus: "good", // Simplificado por ahora
    neutralityScore: 92, // Simplificado por ahora
  }

  const cityAverage = {
    download: 78.2,
    upload: 38.5,
    latency: 22,
  }

  const ispAverage = {
    download: 82.1,
    upload: 40.3,
    latency: 19,
  }

  const getNeutralityStatus = () => {
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
            <Button variant="outline" className="gap-2 bg-transparent">
              <Home className="w-4 h-4" />
              Nueva Prueba
            </Button>
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
                  <div>
                    <div className="text-3xl font-bold text-slate-900">{results.download}</div>
                    <div className="text-sm text-slate-600">Mbps Descarga</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">vs. Promedio ciudad</span>
                    <span className={results.download > cityAverage.download ? "text-green-600" : "text-red-600"}>
                      {results.download > cityAverage.download ? "+" : ""}
                      {(((results.download - cityAverage.download) / cityAverage.download) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(results.download / cityAverage.download) * 50} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900">{results.upload}</div>
                    <div className="text-sm text-slate-600">Mbps Subida</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">vs. Promedio ISP</span>
                    <span className={results.upload > ispAverage.upload ? "text-green-600" : "text-red-600"}>
                      {results.upload > ispAverage.upload ? "+" : ""}
                      {(((results.upload - ispAverage.upload) / ispAverage.upload) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(results.upload / ispAverage.upload) * 50} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900">{results.latency}</div>
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
                      <span className="text-sm text-slate-600">YouTube</span>
                      <div className="flex items-center gap-2">
                        <Progress value={88} className="w-20 h-2" />
                        <span className="text-sm font-medium">88%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Netflix</span>
                      <div className="flex items-center gap-2">
                        <Progress value={92} className="w-20 h-2" />
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Servidor Neutral</span>
                      <div className="flex items-center gap-2">
                        <Progress value={95} className="w-20 h-2" />
                        <span className="text-sm font-medium">95%</span>
                      </div>
                    </div>
                  </div>
                </div>
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
                        {results.download} / {cityAverage.download} Mbps
                      </span>
                    </div>
                    <Progress value={(results.download / (cityAverage.download * 1.5)) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subida</span>
                      <span>
                        {results.upload} / {cityAverage.upload} Mbps
                      </span>
                    </div>
                    <Progress value={(results.upload / (cityAverage.upload * 1.5)) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Latencia</span>
                      <span>
                        {results.latency} / {cityAverage.latency} ms
                      </span>
                    </div>
                    <Progress value={100 - (results.latency / cityAverage.latency) * 50} className="h-2" />
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
                        {results.download} / {ispAverage.download} Mbps
                      </span>
                    </div>
                    <Progress value={(results.download / (ispAverage.download * 1.5)) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subida</span>
                      <span>
                        {results.upload} / {ispAverage.upload} Mbps
                      </span>
                    </div>
                    <Progress value={(results.upload / (ispAverage.upload * 1.5)) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Latencia</span>
                      <span>
                        {results.latency} / {ispAverage.latency} ms
                      </span>
                    </div>
                    <Progress value={100 - (results.latency / ispAverage.latency) * 50} className="h-2" />
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
    </div>
  )
}
