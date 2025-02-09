import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { title, description, courseId } = await request.json()

    const newModule = await prisma.module.create({
      data: {
        title,
        description,
        courseId,
      },
    })

    return NextResponse.json(newModule)
  } catch (error) {
    console.error('Erro ao criar módulo:', error)
    return NextResponse.json(
      { error: 'Erro ao criar módulo' },
      { status: 500 }
    )
  }
}