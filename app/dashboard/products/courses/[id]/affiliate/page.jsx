import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AffiliateProgram from '@/app/components/affiliate/AffiliateProgram'
import { authOptions } from '@/app/api/auth'

// Removido o tipo de parâmetros
export default async function CourseAffiliatePage({ params }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <div>Acesso negado</div>
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.id,
    },
    include: {
      affiliateProgram: {
        include: {
          affiliates: {
            include: {
              user: true,
              sales: true,
            }
          }
        }
      }
    }
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Programa de Afiliados</h1>
      <AffiliateProgram course={course} />
    </div>
  )
}