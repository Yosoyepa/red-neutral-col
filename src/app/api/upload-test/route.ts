import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Simular el procesamiento de datos de upload
    const body = await request.blob()
    
    // Responder con éxito
    return NextResponse.json({ 
      success: true, 
      size: body.size,
      message: 'Upload test completed' 
    })
  } catch (error) {
    console.error('Error in upload test:', error)
    return NextResponse.json({ error: 'Upload test failed' }, { status: 500 })
  }
}
