import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth'

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { ebookId } = await req.json()

  try {
    // Verifica se o usuário já é afiliado a este eBook
    const existingAffiliate = await prisma.affiliate.findFirst({
      where: {
        userId: session.user.id,
        ebookId: ebookId
      }
    })

    if (existingAffiliate) {
      return NextResponse.json({ error: 'Você já é afiliado deste eBook' }, { status: 400 })
    }

    // Gerar um código de afiliado único
    const affiliateCode = generateAffiliateCode()

    // Criação do registro de afiliação
    await prisma.affiliate.create({
      data: {
        userId: session.user.id,
        ebookId: ebookId,
        affiliateCode: affiliateCode
      }
    })

    return NextResponse.json({ message: 'Afiliado com sucesso' })
  } catch (error) {
    console.error('Erro ao se tornar afiliado:', error)
    return NextResponse.json({ error: 'Erro ao se tornar afiliado' }, { status: 500 })
  }
}

// Função para gerar um código de afiliado único
function generateAffiliateCode() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 15)}`
}
