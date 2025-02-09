import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
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

    const { title, description, videoUrl } = await request.json()

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: params.id,
        module: {
          course: {
            instructorId: user.id
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Aula não encontrada' }, { status: 404 })
    }

    const updatedLesson = await prisma.lesson.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        videoUrl,
      },
    })

    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error('Erro ao atualizar aula:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar aula' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: params.id,
        module: {
          course: {
            instructorId: user.id
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Aula não encontrada' }, { status: 404 })
    }

    await prisma.lesson.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Aula excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir aula:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir aula' },
      { status: 500 }
    )
  }
} 