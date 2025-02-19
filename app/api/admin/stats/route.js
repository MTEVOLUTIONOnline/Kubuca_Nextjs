import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }

    // Estatísticas de Usuários
    const totalUsers = await prisma.user.count()
    const activeUsers = await prisma.user.count({
      where: { active: true }
    })

    // Estatísticas de Saldo
    const usersWithBalance = await prisma.user.findMany({
      select: { balance: true }
    })
    const totalBalance = usersWithBalance.reduce((sum, user) => sum + user.balance, 0)
    const averageBalance = totalBalance / (totalUsers || 1)

    // Estatísticas de Saques
    const pendingWithdrawals = await prisma.payment.count({
      where: { status: 'PENDING' }
    })
    const withdrawals = await prisma.payment.findMany({
      where: { status: 'PENDING' },
      select: { amount: true }
    })
    const totalWithdrawalsAmount = withdrawals.reduce((sum, w) => sum + w.amount, 0)

    // Atividades Recentes
    const recentActivities = await prisma.activity.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    })

    // Estatísticas de Vendas
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const todaySales = await prisma.purchase.aggregate({
      where: { 
        createdAt: { gte: today },
        status: 'completed'
      },
      _sum: { amount: true }
    })

    const monthSales = await prisma.purchase.aggregate({
      where: {
        createdAt: { gte: firstDayOfMonth },
        status: 'completed'
      },
      _sum: { amount: true }
    })

    const totalSales = await prisma.purchase.aggregate({
      where: { status: 'completed' },
      _sum: { amount: true }
    })

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalBalance,
      averageBalance,
      pendingWithdrawals,
      totalWithdrawalsAmount,
      recentActivities,
      todaySales: todaySales._sum.amount || 0,
      monthSales: monthSales._sum.amount || 0,
      totalSales: totalSales._sum.amount || 0
    })

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
} 