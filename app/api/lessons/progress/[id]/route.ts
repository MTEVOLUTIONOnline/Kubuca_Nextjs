import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { completed } = await request.json()

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: params.id,
        },
      },
      update: {
        completed,
      },
      create: {
        userId: user.id,
        lessonId: params.id,
        completed,
      },
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar progresso' },
      { status: 500 }
    )
  }
} 