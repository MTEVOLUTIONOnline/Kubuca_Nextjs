import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'

import { prisma } from '@/lib/prisma'
import { fazerPagamentoMpesa, fazerPagamentoEmola } from '@/utils/mpesa'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email!
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const { phone, amount, courseId, method, affiliateCode } = await request.json()

    let affiliateId = null

    if (affiliateCode) {
      const affiliate = await prisma.affiliate.findUnique({
        where: { affiliateCode }
      })
      if (affiliate) {
        affiliateId = affiliate.id
      }
    }

    try {
      const paymentResponse = method === 'emola' 
        ? await fazerPagamentoEmola({ phone, amount, courseId })
        : await fazerPagamentoMpesa({ phone, amount, courseId })

      if (paymentResponse.success) {
        const purchase = await prisma.purchase.create({
          data: {
            userId: user.id,
            courseId,
            amount,
            status: 'completed',
            affiliateId
          },
        })

        if (affiliateId) {
          const affiliate = await prisma.affiliate.findUnique({
            where: { id: affiliateId },
            include: { course: true }
          })

          if (affiliate) {
            const commission = (amount * affiliate.course.affiliateCommission) / 100

            await prisma.affiliate.update({
              where: { id: affiliateId },
              data: {
                earnings: { increment: commission },
                user: {
                  update: {
                    affiliateEarnings: { increment: commission }
                  }
                }
              }
            })
          }
        }

        return NextResponse.json({
          success: true,
          purchase,
          transactionId: paymentResponse.transactionId || paymentResponse.id
        })
      } else {
        return NextResponse.json(
          { error: paymentResponse.message || `Falha no pagamento ${method}` },
          { status: 400 }
        )
      }
    } catch (paymentError) {
      console.error('Erro no pagamento:', paymentError)
      return NextResponse.json(
        { error: 'Erro ao processar pagamento' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    )
  }
} 