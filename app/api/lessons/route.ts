import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
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

    const { title, description, videoUrl, moduleId } = await request.json()

    // Verifica se o módulo pertence ao usuário
    const module = await prisma.module.findFirst({
      where: {
        id: moduleId,
        course: {
          instructorId: user.id
        }
      }
    })

    if (!module) {
      return NextResponse.json({ error: 'Módulo não encontrado' }, { status: 404 })
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        videoUrl,
        moduleId,
      },
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Erro ao criar aula:', error)
    return NextResponse.json(
      { error: 'Erro ao criar aula' },
      { status: 500 }
    )
  }
} 