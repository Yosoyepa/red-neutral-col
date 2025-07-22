import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Obtener solo resultados que han sido compartidos públicamente
    const results = await prisma.testResult.findMany({
      where: {
        isPublic: true,
        shareId: {
          not: null
        }
      },
      select: {
        id: true,
        shareId: true,
        isp: true,
        city: true,
        downloadSpeed: true,
        uploadSpeed: true,
        ping: true,
        throttlingRatio: true,
        testDate: true,
        sharedAt: true,
        videoStreamingSpeed: true,
        socialMediaSpeed: true,
        generalWebSpeed: true
      },
      orderBy: {
        sharedAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Contar total de resultados públicos
    const totalCount = await prisma.testResult.count({
      where: {
        isPublic: true,
        shareId: {
          not: null
        }
      }
    });

    return NextResponse.json({
      results,
      totalCount,
      hasMore: offset + limit < totalCount
    });

  } catch (error) {
    console.error('Error al obtener resultados públicos:', error);
    return NextResponse.json(
      { error: 'Error al obtener resultados' },
      { status: 500 }
    );
  }
}
