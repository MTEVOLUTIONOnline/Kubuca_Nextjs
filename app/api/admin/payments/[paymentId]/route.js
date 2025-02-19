import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      )
    }

    const paymentId = request.url.split('/').pop()
    const { status, notes } = await request.json()

    // Busca o pagamento atual
    const currentPayment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: true }
    })

    if (!currentPayment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    // Atualiza o pagamento
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        notes,
        processedAt: status === 'COMPLETED' ? new Date() : null
      }
    })

    // Se o pagamento foi completado, atualiza o saldo do usuário
    if (status === 'COMPLETED') {
      await prisma.user.update({
        where: { id: currentPayment.userId },
        data: {
          balance: {
            decrement: currentPayment.amount
          }
        }
      })

      // Registra a atividade
      await prisma.activity.create({
        data: {
          userId: currentPayment.userId,
          description: `Saque de ${currentPayment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })} processado com sucesso`
        }
      })
    } else if (status === 'REJECTED') {
      // Registra a atividade de rejeição
      await prisma.activity.create({
        data: {
          userId: currentPayment.userId,
          description: `Saque de ${currentPayment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })} foi rejeitado`
        }
      })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pagamento' },
      { status: 500 }
    )
  }
} 