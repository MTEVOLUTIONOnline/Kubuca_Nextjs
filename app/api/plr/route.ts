import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth'

export async function POST(req: Request) {
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

    const { title, description, price, terms, ebookUrls, thumbnailUrl, affiliateCommission } = await req.json()

    // Verifique se todos os campos necessários estão presentes
    if (!title || !description || !price || !terms || !ebookUrls || !thumbnailUrl) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
    }
    const userId = user.id

    const plr = await prisma.pLR.create({
      data: {
        userId,
        type: 'EBOOK',
        title,
        description,
        price,
        terms,
        thumbnailUrl,
        affiliateCommission,
        ebookUrls: JSON.stringify(ebookUrls), // Convertendo array para JSON string
      }
    })

    return NextResponse.json(plr)
  } catch (error) {
    console.error('Erro ao criar PLR:', error) // Log do erro para depuração
    return NextResponse.json(
      { error: 'Erro ao criar PLR' },
      { status: 500 }
    )
  }
} 