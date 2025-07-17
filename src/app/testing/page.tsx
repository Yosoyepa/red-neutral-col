"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, Zap, Shield } from "lucide-react"

export default function TestingScreen() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentPhase, setCurrentPhase] = useState<"ping" | "download" | "upload" | "complete">("ping")
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState("Iniciando prueba...")
  const [downloadSpeed, setDownloadSpeed] = useState(0)
  const [uploadSpeed, setUploadSpeed] = useState(0)
  const [ping, setPing] = useState(0)
  const [worker, setWorker] = useState<Worker | null>(null)
  
  // Leer parámetros de la URL
  const isp = searchParams.get('isp') || 'unknown'
  const city = searchParams.get('city') || 'unknown'

  // Función para manejar la finalización de la prueba
  const handleTestComplete = async (results: any) => {
    try {
      const testData = {
        isp,
        city,
        downloadSpeed: results.downloadSpeed,
        uploadSpeed: results.uploadSpeed,
        ping: results.ping,
        jitter: results.jitter,
        testDate: results.testDate
      }
      
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })
      
      if (response.ok) {
        const result = await response.json()
        router.push(`/results/${result.id}`)
      } else {
        console.error('Error al enviar resultados:', response.statusText)
        setCurrentMessage('Error al guardar resultados')
      }
    } catch (error) {
      console.error('Error al enviar resultados:', error)
      setCurrentMessage('Error al guardar resultados')
    }
  }

  useEffect(() => {
    // Inicializar Web Worker
    const speedWorker = new Worker('/speed-test-worker.js')
    setWorker(speedWorker)

    // Configurar listener para mensajes del worker
    speedWorker.onmessage = (event) => {
      const { type, phase, progress: workerProgress, message, currentDownload, currentUpload, currentPing, results } = event.data
      
      if (type === 'progress') {
        setProgress(workerProgress)
        setCurrentMessage(message)
        setCurrentPhase(phase)
        
        if (currentDownload !== undefined) {
          setDownloadSpeed(currentDownload)
        }
        if (currentUpload !== undefined) {
          setUploadSpeed(currentUpload)
        }
        if (currentPing !== undefined) {
          setPing(currentPing)
        }
      } else if (type === 'complete') {
        setProgress(100)
        setCurrentMessage('Prueba completada')
        setCurrentPhase('complete')
        
        // Proceder a la siguiente tarea (enviar resultados al API)
        handleTestComplete(results)
      } else if (type === 'error') {
        setCurrentMessage('Error en la prueba: ' + message)
        console.error('Error del worker:', message)
      }
    }

    // Iniciar la prueba
    speedWorker.postMessage({ type: 'start' })

    return () => {
      speedWorker.terminate()
    }
  }, [])

  const getTestInfo = () => {
    switch (currentPhase) {
      case "ping":
        return {
          title: "Midiendo Latencia...",
          description: "Probando el tiempo de respuesta de la conexión",
          icon: Zap,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        }
      case "download":
        return {
          title: "Midiendo Descarga...",
          description: "Probando la velocidad de descarga desde múltiples servidores",
          icon: Download,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        }
      case "upload":
        return {
          title: "Midiendo Subida...",
          description: "Evaluando la velocidad de carga de datos",
          icon: Upload,
          color: "text-green-600",
          bgColor: "bg-green-100",
        }
      case "complete":
        return {
          title: "Prueba Completada",
          description: "Guardando resultados y redirigiendo...",
          icon: Shield,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        }
      default:
        return {
          title: "Iniciando...",
          description: "Preparando la prueba de velocidad",
          icon: Shield,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        }
    }
  }

  const testInfo = getTestInfo()
  const TestIcon = testInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Red Neutral</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Prueba en Progreso</h1>
          <p className="text-slate-600">Por favor espera mientras analizamos tu conexión</p>
        </div>

        {/* Main Test Card */}
        <Card className="shadow-2xl border-0 bg-white mb-8">
          <CardContent className="p-8">
            {/* Current Test Status */}
            <div className="text-center mb-8">
              <div
                className={`w-20 h-20 ${testInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <TestIcon className={`w-10 h-10 ${testInfo.color}`} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{testInfo.title}</h2>
              <p className="text-slate-600">{testInfo.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Progreso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Speed Display */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {downloadSpeed.toFixed(1)}
                </div>
                <div className="text-sm text-slate-600">Mbps</div>
                <div className="text-xs text-slate-500 mt-1">Descarga</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {uploadSpeed.toFixed(1)}
                </div>
                <div className="text-sm text-slate-600">Mbps</div>
                <div className="text-xs text-slate-500 mt-1">Subida</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {ping}
                </div>
                <div className="text-sm text-slate-600">ms</div>
                <div className="text-xs text-slate-500 mt-1">Latencia</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Steps */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: "ping", label: "Latencia", icon: Zap },
            { key: "download", label: "Descarga", icon: Download },
            { key: "upload", label: "Subida", icon: Upload },
          ].map((step, index) => {
            const StepIcon = step.icon
            const isActive = currentPhase === step.key
            const phases = ["ping", "download", "upload", "complete"]
            const currentIndex = phases.indexOf(currentPhase)
            const isCompleted = currentIndex > index

            return (
              <Card
                key={step.key}
                className={`border-2 ${isActive ? "border-blue-500 bg-blue-50" : isCompleted ? "border-green-500 bg-green-50" : "border-slate-200"}`}
              >
                <CardContent className="p-4 text-center">
                  <StepIcon
                    className={`w-6 h-6 mx-auto mb-2 ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-slate-400"}`}
                  />
                  <div
                    className={`text-sm font-medium ${isActive ? "text-blue-900" : isCompleted ? "text-green-900" : "text-slate-600"}`}
                  >
                    {step.label}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
