import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import TransactionsTable from '@/app/components/dashboard/TransactionsTable'

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!
    }
  })

  if (!user) {
    redirect('/login')
  }

  // Buscar todas as transações do usuário
  const transactions = await prisma.purchase.findMany({
    where: {
      OR: [
        // Compras feitas pelo usuário
        { userId: user.id },
        // Vendas dos cursos do usuário
        { 
          course: {
            instructorId: user.id
          }
        },
        // Vendas como afiliado
        {
          affiliateId: {
            in: (await prisma.affiliate.findMany({
              where: { userId: user.id },
              select: { id: true }
            })).map(a => a.id)
          }
        }
      ]
    },
    include: {
      course: {
        select: {
          title: true,
          instructor: {
            select: {
              name: true
            }
          }
        }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      },
      affiliate: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Histórico de Transações</h1>
      <TransactionsTable transactions={transactions} currentUserId={user.id} />
    </div>
  )
} 