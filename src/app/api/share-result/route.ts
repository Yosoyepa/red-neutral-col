import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { customAlphabet } from 'nanoid';

const prisma = new PrismaClient();

// Generar ID corto y único para compartir
const nanoid = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 8);

export async function POST(request: Request) {
  try {
    const { resultId } = await request.json();
    
    if (!resultId) {
      return NextResponse.json(
        { error: 'ID del resultado es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el resultado existe
    const result = await prisma.testResult.findUnique({
      where: { id: resultId }
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Resultado no encontrado' },
        { status: 404 }
      );
    }

    // Si ya tiene un shareId, devolverlo
    if (result.shareId) {
      return NextResponse.json({
        shareId: result.shareId,
        shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/share/${result.shareId}`
      });
    }

    // Generar nuevo shareId único
    let shareId: string;
    let isUnique = false;
    
    while (!isUnique) {
      shareId = nanoid();
      const existing = await prisma.testResult.findUnique({
        where: { shareId }
      });
      if (!existing) {
        isUnique = true;
      }
    }

    // Actualizar el resultado con el shareId
    const updatedResult = await prisma.testResult.update({
      where: { id: resultId },
      data: {
        shareId: shareId!,
        isPublic: true,
        sharedAt: new Date()
      }
    });

    return NextResponse.json({
      shareId: updatedResult.shareId,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/share/${updatedResult.shareId}`
    });

  } catch (error) {
    console.error('Error al compartir resultado:', error);
    return NextResponse.json(
      { error: 'Error al compartir resultado' },
      { status: 500 }
    );
  }
}

// Obtener resultado compartido
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get('shareId');

    if (!shareId) {
      return NextResponse.json(
        { error: 'ID de compartir es requerido' },
        { status: 400 }
      );
    }

    const result = await prisma.testResult.findUnique({
      where: { 
        shareId,
        isPublic: true 
      }
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Resultado no encontrado o no es público' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error al obtener resultado compartido:', error);
    return NextResponse.json(
      { error: 'Error al obtener resultado' },
      { status: 500 }
    );
  }
}
