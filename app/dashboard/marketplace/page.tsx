import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import MarketplaceList from '@/app/components/marketplace/MarketplaceList'
import { redirect } from 'next/navigation'

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
      {/* <h1 className="text-2xl font-bold mb-6">Marketplace de Afiliados</h1> */}
      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white ">
          <h2 className="text-xl text-gray-600">
            Nenhum curso disponível para afiliação no momento.
          </h2>
          <p className="text-gray-500 mt-2">
            Volte mais tarde para ver novos cursos.
          </p>
        </div>
      ) : (
        <MarketplaceList courses={courses} />
      )}
    </div>
  )
} 