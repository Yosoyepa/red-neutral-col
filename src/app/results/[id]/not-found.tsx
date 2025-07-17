import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle, Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Red Neutral</span>
          </div>
        </div>

        {/* Error Card */}
        <Card className="shadow-xl border-0 bg-white">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Resultado no encontrado
            </h1>
            
            <p className="text-slate-600 mb-6">
              No pudimos encontrar el resultado de la prueba que estás buscando. 
              Es posible que el enlace esté incorrecto o que el resultado haya expirado.
            </p>
            
            <div className="space-y-3">
              <Link href="/" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  <Home className="w-4 h-4" />
                  Realizar Nueva Prueba
                </Button>
              </Link>
              
              <p className="text-sm text-slate-500">
                Realiza una nueva prueba de velocidad para obtener resultados actualizados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
