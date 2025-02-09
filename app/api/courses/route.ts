import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth'
import { prisma } from '@/lib/prisma'

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

    const data = await request.json()
    
    // Validar se tem imageUrl
    if (!data.imageUrl) {
      return NextResponse.json({ error: 'Imagem é obrigatória' }, { status: 400 })
    }

    const { title, description, price, imageUrl, affiliateCommission } = data

    // Validação dos dados
    if (!title || !description || price === undefined) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    // commissionNumber
    const priceNumber = Number(price)
    const commissionNumber = Number(affiliateCommission)

    if (isNaN(priceNumber) || priceNumber < 0) {
      return NextResponse.json({ error: 'Preço inválido' }, { status: 400 })
    }

    if (isNaN(commissionNumber) || commissionNumber < 0 || commissionNumber > 100) {
      return NextResponse.json({ error: 'Comissão inválida' }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: priceNumber,
        imageUrl,
        affiliateCommission: commissionNumber,
        instructor: {
          connect: {
            id: user.id
          }
        }
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Erro ao criar curso:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
} 