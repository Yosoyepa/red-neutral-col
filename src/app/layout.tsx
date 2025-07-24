import type { Metadata } from 'next'
import './globals.css'
import { ChatBot } from '@/components/ChatBot'

export const metadata: Metadata = {
  title: 'Red Neutral Colombia',
  description: 'Herramienta para medir la neutralidad de la red en Colombia',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <ChatBot />
      </body>
    </html>
  )
}
