"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

// Función simple para parsear formato markdown básico
function parseMarkdown(text: string): string {
  return text
    // Primero manejamos las negritas (doble asterisco)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Luego las cursivas (asterisco simple) pero solo si está rodeado de espacios o al inicio/fin
    .replace(/(?:^|\s)\*([^\*\n]+?)\*(?:\s|$)/g, ' <em>$1</em> ')
    // Saltos de línea dobles para párrafos
    .replace(/\n\n/g, '<br /><br />')
    // Saltos de línea simples
    .replace(/\n/g, '<br />')
    // Listas con guiones
    .replace(/^- (.+)$/gm, '• $1')
    // Listas numeradas
    .replace(/^\d+\. (.+)$/gm, '• $1')
    // Limpieza de espacios extras
    .trim()
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "¡Hola! Soy tu asistente especializado en neutralidad de la red en Colombia. ¿En qué puedo ayudarte? Puedo explicarte conceptos, resolver dudas sobre tus derechos, o ayudarte a interpretar los resultados de las pruebas.",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll al último mensaje
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor")
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <Card className="fixed bottom-20 right-4 w-[calc(100vw-2rem)] sm:w-80 max-w-80 h-[500px] max-h-[70vh] flex flex-col shadow-2xl z-50 border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          <h3 className="font-medium text-sm">Asistente Red Neutral</h3>
        </div>
        <Button
          onClick={onClose}
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-blue-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.role === "assistant" ? (
                  <div 
                    className="text-sm" 
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
                  />
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
