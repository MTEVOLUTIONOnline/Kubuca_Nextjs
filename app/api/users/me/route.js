import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Função para buscar o usuário
const getUserProfile = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      withdrawalFee: true,
      balance: true,
      phoneNumber: true,
      image: true
    }
  })
}

// Função para atualizar o usuário
const updateUserProfile = async (userId, data) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      image: data.image
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      image: true
    }
  })
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await getUserProfile(session.user.id)

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar usuário', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validar dados
    if (data.name && data.name.length < 2) {
      return NextResponse.json(
        { error: 'Nome muito curto' },
        { status: 400 }
      )
    }

    if (data.phoneNumber && !/^\+?\d{9,}$/.test(data.phoneNumber)) {
      return NextResponse.json(
        { error: 'Número de telefone inválido' },
        { status: 400 }
      )
    }

    // Atualizar usuário
    const updatedUser = await updateUserProfile(session.user.id, data)

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário', details: error.message },
      { status: 500 }
    )
  }
} 