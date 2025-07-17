"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wifi, Shield, BarChart3, Users, ArrowRight, Globe } from "lucide-react"
import TestingScreen from "./testing/page"
import ResultsScreen from "./results/page"

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<"home" | "testing" | "results">("home")
  const [formData, setFormData] = useState({
    isp: "",
    city: "",
  })

  const handleStartTest = () => {
    if (formData.isp && formData.city) {
      setCurrentScreen("testing")
      // Simulate test duration
      setTimeout(() => {
        setCurrentScreen("results")
      }, 8000)
    }
  }

  if (currentScreen === "testing") {
    return <TestingScreen />
  }

  if (currentScreen === "results") {
    return <ResultsScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Red Neutral</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                ¿Qué es?
              </a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                Resultados
              </a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                Sobre nosotros
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              Herramienta gratuita para Colombia
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              ¿Tu internet es realmente <span className="text-blue-600">neutral</span>?
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Mide tu conexión y descubre si tu proveedor de internet en Colombia respeta la neutralidad de la red.
            </p>
          </div>

          {/* Test Form */}
          <Card className="max-w-md mx-auto shadow-xl border-0 bg-white">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="isp" className="text-sm font-medium text-slate-700">
                    Tu Proveedor (ISP)
                  </Label>
                  <Select value={formData.isp} onValueChange={(value) => setFormData({ ...formData, isp: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecciona tu ISP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claro">Claro</SelectItem>
                      <SelectItem value="tigo">Tigo</SelectItem>
                      <SelectItem value="movistar">Movistar</SelectItem>
                      <SelectItem value="etb">ETB</SelectItem>
                      <SelectItem value="une">UNE</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-slate-700">
                    Tu Ciudad
                  </Label>
                  <Input
                    id="city"
                    placeholder="Ej: Bogotá, Medellín, Cali..."
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-12"
                  />
                </div>

                <Button
                  onClick={handleStartTest}
                  disabled={!formData.isp || !formData.city}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
                >
                  Iniciar Prueba
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-slate-500 mt-4">
            La prueba toma aproximadamente 30 segundos • Completamente gratuito
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              ¿Por qué es importante la neutralidad de la red?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Wifi className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Acceso Equitativo</h3>
                  <p className="text-slate-600 text-sm">
                    Todos los sitios web y servicios deben tener la misma velocidad de acceso.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Transparencia</h3>
                  <p className="text-slate-600 text-sm">
                    Los usuarios tienen derecho a saber cómo funciona realmente su conexión.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Empoderamiento</h3>
                  <p className="text-slate-600 text-sm">
                    Con datos claros, puedes tomar mejores decisiones sobre tu servicio.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Red Neutral</span>
            </div>
            <p className="text-slate-400 mb-6">
              Una herramienta independiente para promover la transparencia en el internet colombiano.
            </p>
            <div className="flex justify-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
