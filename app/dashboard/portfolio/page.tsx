import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import PortfolioStats from '@/app/components/dashboard/PortfolioStats'

export default async function PortfolioPage() {
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

  // Buscar estatísticas financeiras
  const stats = await prisma.purchase.aggregate({
    where: {
      OR: [
        // Vendas como instrutor
        {
          course: {
            instructorId: user.id
          },
          status: 'completed'
        },
        // Vendas como afiliado
        {
          affiliate: {
            userId: user.id
          },
          status: 'completed'
        }
      ]
    },
    _sum: {
      creatorEarnings: true,
      affiliateEarnings: true
    }
  })

  const portfolio = {
    balance: user.balance || 0,
    totalEarnings: (stats._sum.creatorEarnings || 0) + (stats._sum.affiliateEarnings || 0),
    creatorEarnings: stats._sum.creatorEarnings || 0,
    affiliateEarnings: stats._sum.affiliateEarnings || 0,
    minimumWithdraw: 500 // Valor mínimo para saque em MZN
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Meu Portfólio</h1>
      <PortfolioStats portfolio={portfolio} />
    </div>
  )
} 