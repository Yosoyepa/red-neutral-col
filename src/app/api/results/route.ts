import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { TestFormData } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { isp, city, downloadSpeed, uploadSpeed, ping, jitter, testDate } = body
    
    // Validar campos requeridos
    if (!isp || !city || downloadSpeed === undefined || uploadSpeed === undefined || ping === undefined) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }
    
    // Validar rangos razonables
    const downloadSpeedNum = parseFloat(downloadSpeed)
    const uploadSpeedNum = parseFloat(uploadSpeed)
    const pingNum = parseInt(ping)
    const jitterNum = parseFloat(jitter || 0)
    
    if (downloadSpeedNum < 0 || downloadSpeedNum > 10000) {
      return NextResponse.json({ error: 'Velocidad de descarga debe estar entre 0 y 10000 Mbps' }, { status: 400 })
    }
    
    if (uploadSpeedNum < 0 || uploadSpeedNum > 10000) {
      return NextResponse.json({ error: 'Velocidad de subida debe estar entre 0 y 10000 Mbps' }, { status: 400 })
    }
    
    if (pingNum < 0 || pingNum > 10000) {
      return NextResponse.json({ error: 'Ping debe estar entre 0 y 10000 ms' }, { status: 400 })
    }
    
    if (jitterNum < 0 || jitterNum > 1000) {
      return NextResponse.json({ error: 'Jitter debe estar entre 0 y 1000 ms' }, { status: 400 })
    }
    
    // Crear registro en la base de datos
    const result = await prisma.testResult.create({
      data: {
        isp,
        city,
        downloadSpeed: downloadSpeedNum,
        uploadSpeed: uploadSpeedNum,
        ping: pingNum,
        jitter: jitterNum,
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
