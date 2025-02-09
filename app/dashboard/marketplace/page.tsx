import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import MarketplaceList from '@/app/components/marketplace/MarketplaceList'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth'

export default async function MarketplacePage() {
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

  // Buscar PLRs, excluindo os do próprio usuário
  const plrs = await prisma.pLR.findMany({
    where: {
      AND: [
        {
          affiliateCommission: {
            gt: 0 // Apenas PLRs com programa de afiliados
          }
        },
        {
          userId: {
            not: user.id // Excluir PLRs do próprio usuário
          }
        }
      ]
    },
    include: {
      user: {
        select: {
          name: true
        }
      },
      affiliates: {
        where: {
          userId: user.id
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Buscar cursos, excluindo os que o usuário criou
  const courses = await prisma.course.findMany({
    where: {
      AND: [
        {
          affiliateCommission: {
            gt: 0 // Cursos com programa de afiliados ativo
          }
        },
        {
          instructorId: {
            not: user.id // Excluir cursos do próprio usuário
          }
        }
      ]
    },
    include: {
      instructor: {
        select: {
          name: true,
          email: true
        }
      },
      affiliates: {
        where: {
          userId: user.id
        }
      }
    },
    orderBy: {
      createdAt: 'desc' // Mostrar cursos mais recentes primeiro
    }
  })

  return (
    <div className="p-6">
      {courses.length === 0 && plrs.length === 0 ? (
        <div className="text-center py-12 bg-white">
          <h2 className="text-xl text-gray-600">
            Nenhum curso ou eBook disponível para afiliação no momento.
          </h2>
          <p className="text-gray-500 mt-2">
            Volte mais tarde para ver novos cursos e eBooks.
          </p>
        </div>
      ) : (
        <MarketplaceList courses={courses} plrs={plrs} />
      )}
    </div>
  )
}