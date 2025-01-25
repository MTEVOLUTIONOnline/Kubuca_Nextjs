import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Total de alunos (usando groupBy para contar usuários únicos)
    const studentsResult = await prisma.purchase.groupBy({
      by: ['userId'],
      where: {
        course: {
          instructorId: user.id
        },
        status: 'completed'
      }
    })

    const totalStudents = studentsResult.length

    // Total de cursos
    const totalCourses = await prisma.course.count({
      where: {
        instructorId: user.id
      }
    })

    // Total de vendas diretas
    const salesStats = await prisma.purchase.aggregate({
      where: {
        course: {
          instructorId: user.id
        },
        status: 'completed'
      },
      _sum: {
        creatorEarnings: true
      }
    })

    // Total de ganhos como afiliado
    const affiliateStats = await prisma.purchase.aggregate({
      where: {
        affiliate: {
          userId: user.id
        },
        status: 'completed'
      },
      _sum: {
        affiliateEarnings: true
      }
    })

    return NextResponse.json({
      totalStudents,
      totalCourses,
      totalRevenue: salesStats._sum.creatorEarnings || 0,
      totalAffiliateEarnings: affiliateStats._sum.affiliateEarnings || 0
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
} 