import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { isp, city, downloadSpeed, uploadSpeed, ping, jitter, testDate } = body
    
    // Validar campos requeridos
    if (!isp || !city || downloadSpeed === undefined || uploadSpeed === undefined || ping === undefined) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }
    
    // Crear registro en la base de datos
    const result = await prisma.testResult.create({
      data: {
        isp,
        city,
        downloadSpeed: parseFloat(downloadSpeed),
        uploadSpeed: parseFloat(uploadSpeed),
        ping: parseInt(ping),
        jitter: parseFloat(jitter || 0),
        testDate: testDate ? new Date(testDate) : new Date(),
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      id: result.id,
      message: 'Resultados guardados exitosamente' 
    })
  } catch (error) {
    console.error('Error guardando resultados:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
