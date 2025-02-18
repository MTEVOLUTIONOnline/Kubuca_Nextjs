import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth'

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

    const { courseId, affiliateCode } = await request.json()

    // Buscar curso com dados do instrutor
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: true
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 })
    }

    // Verificar se já comprou
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
        status: 'completed'
      }
    })

    if (existingPurchase) {
      return NextResponse.json({ error: 'Você já comprou este curso' }, { status: 400 })
    }

    // Calcular ganhos
    let affiliateId = ""
    let affiliateUserId = null
    let creatorEarnings = course.price
    let affiliateEarnings = null

    if (affiliateCode && course.affiliateCommission > 0) {
      const affiliate = await prisma.affiliate.findFirst({
        where: {
          affiliateCode,
          courseId
        }
      })
      
      if (affiliate) {
        affiliateId = affiliate.id
        affiliateUserId = affiliate.userId // Guardamos o ID do usuário afiliado
        // Calcula comissão do afiliado
        affiliateEarnings = (course.price * course.affiliateCommission) / 100
        // Ajusta ganhos do criador
        creatorEarnings = course.price - affiliateEarnings
      }
    }

    // Usar transação para garantir consistência
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar a compra
      const purchase = await tx.purchase.create({
        data: {
          userId: user.id,
          courseId: courseId,
          amount: course.price,
          status: 'completed',
          affiliateId,
          creatorEarnings,
          affiliateEarnings,
        }
      })

      // 2. Atualizar saldo do instrutor
      await tx.user.update({
        where: { id: course.instructorId },
        data: {
          balance: {
            increment: creatorEarnings
          }
        }
      })

      // 3. Se tiver afiliado, atualizar saldo e ganhos dele
      if (affiliateUserId && affiliateEarnings) {
        await tx.user.update({
          where: { id: affiliateUserId }, // Usamos o ID do usuário afiliado
          data: {
            balance: {
              increment: affiliateEarnings
            },
            affiliateEarnings: {
              increment: affiliateEarnings
            }
          }
        })

        // 4. Atualizar ganhos do link de afiliado
        await tx.affiliate.update({
          where: {id: affiliateId},
          data: {
            earnings: {
              increment: affiliateEarnings
            }
          }
        })
      }

      return purchase
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao processar compra:', error)
    return NextResponse.json(
      { error: 'Erro ao processar compra' },
      { status: 500 }
    )
  }
} 