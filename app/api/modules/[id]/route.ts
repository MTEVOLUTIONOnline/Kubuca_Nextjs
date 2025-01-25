import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
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

    const { title, description } = await request.json()

    const module = await prisma.module.findFirst({
      where: {
        id: params.id,
        course: {
          instructorId: user.id
        }
      }
    })

    if (!module) {
      return NextResponse.json({ error: 'Módulo não encontrado' }, { status: 404 })
    }

    const updatedModule = await prisma.module.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
      },
    })

    return NextResponse.json(updatedModule)
  } catch (error) {
    console.error('Erro ao atualizar módulo:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar módulo' },
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

    const module = await prisma.module.findFirst({
      where: {
        id: params.id,
        course: {
          instructorId: user.id
        }
      }
    })

    if (!module) {
      return NextResponse.json({ error: 'Módulo não encontrado' }, { status: 404 })
    }

    await prisma.module.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Módulo excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir módulo:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir módulo' },
      { status: 500 }
    )
  }
} 