import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Você precisa estar logado' },
        { status: 401 }
      )
    }

    // Extrair o ID do usuário e parâmetros de paginação
    const userId = request.url.split('/').pop().split('?')[0]
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '8')
    const skip = (page - 1) * limit

    // Buscar total de atividades
    const totalActivities = await prisma.activity.count({
      where: { userId }
    })

    const user = await prisma.user.findUnique({
      where: {
        id: String(userId)
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        active: true,
        withdrawalFee: true,
        lastLogin: true,
        activities: {
          orderBy: {
            createdAt: 'desc'
          },
          take: limit,
          skip: skip,
          select: {
            id: true,
            description: true,
            createdAt: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user,
      totalActivities,
      currentPage: page,
      totalPages: Math.ceil(totalActivities / limit)
    })

  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes do usuário' },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }

    // Extrair o ID do usuário da URL
    const userId = request.url.split('/').pop()
    const { role } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: String(userId) },
      data: { role }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    )
  }
} 