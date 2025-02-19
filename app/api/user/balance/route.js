import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Busca o saldo do usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true }
    })

    // Busca o valor total dos saques pendentes
    const pendingPayments = await prisma.payment.findMany({
      where: {
        userId: session.user.id,
        status: 'PENDING'
      },
      select: { amount: true }
    })

    const pendingBalance = pendingPayments.reduce((total, payment) => total + payment.amount, 0)

    return NextResponse.json({
      balance: user?.balance || 0,
      pendingBalance
    })

  } catch (error) {
    console.error('Erro ao buscar saldo:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar saldo' },
      { status: 500 }
    )
  }
} 