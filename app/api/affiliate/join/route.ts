import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

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

    const { courseId } = await request.json()

    // Verificar se o curso existe e tem programa de afiliados
    const course = await prisma.course.findUnique({
      where: { 
        id: courseId,
        affiliateCommission: {
          gt: 0
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Curso não encontrado ou não disponível para afiliação' }, { status: 404 })
    }

    // Verificar se já é afiliado
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id
        }
      }
    })

    if (existingAffiliate) {
      return NextResponse.json({ error: 'Você já é afiliado deste curso' }, { status: 400 })
    }

    // Criar link de afiliado
    const affiliate = await prisma.affiliate.create({
      data: {
        affiliateCode: nanoid(10),
        user: {
          connect: {
            id: user.id
          }
        },
        course: {
          connect: {
            id: course.id
          }
        }
      },
      include: {
        course: true
      }
    })

    return NextResponse.json(affiliate)
  } catch (error) {
    console.error('Erro ao criar afiliação:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
} 