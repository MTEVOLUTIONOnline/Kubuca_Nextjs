import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PurchasedCourseCard from '@/app/components/my-courses/PurchasedCourseCard'

export default async function MyCourses() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <div>Acesso negado</div>
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!
    },
    include: {
      purchases: {
        where: {
          status: 'completed'
        },
        include: {
          course: {
            include: {
              modules: {
                include: {
                  _count: {
                    select: {
                      lessons: true
                    }
                  }
                }
              },
              instructor: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Meus Cursos</h1>

      {user.purchases.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">Você ainda não comprou nenhum curso.</p>
          <a 
            href="/marketplace" 
            className="text-blue-500 hover:underline"
          >
            Explorar cursos disponíveis
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {user.purchases.map((purchase) => (
            <PurchasedCourseCard
              key={purchase.id}
              course={purchase.course}
            />
          ))}
        </div>
      )}
    </div>
  )
} 