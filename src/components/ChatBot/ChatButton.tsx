"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatButtonProps {
  onClick: () => void
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Abrir chat de asistencia</span>
    </Button>
  )
}
