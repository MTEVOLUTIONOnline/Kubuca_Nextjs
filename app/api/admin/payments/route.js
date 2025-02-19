import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Pegar parâmetros da URL
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search') || ''
    const skip = (page - 1) * limit

    // Construir where clause
    const where = {
      AND: [
        // Filtro de status
        status && status !== 'all' ? { status } : {},
        // Filtro de busca
        search ? {
          OR: [
            { user: { name: { contains: search } } },
            { user: { email: { contains: search } } },
            { mpesaNumber: { contains: search } },
            { mpesaName: { contains: search } }
          ]
        } : {}
      ]
    }

    // Buscar total de registros
    const total = await prisma.payment.count({ where })

    // Buscar pagamentos
    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    return NextResponse.json({
      payments,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })

  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pagamentos' },
      { status: 500 }
    )
  }
} 