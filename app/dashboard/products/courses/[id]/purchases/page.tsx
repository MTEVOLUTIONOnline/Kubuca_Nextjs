import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PurchaseHistory from '@/app/components/dashboard/PurchaseHistory'
import { authOptions } from '@/app/api/auth'

export default async function CoursePurchasesPage({
  params,
}: {
  params: { courseId: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <div>Acesso negado</div>
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!
    }
  })

  if (!user) {
    return <div>Usuário não encontrado</div>
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
      instructorId: user.id,
    },
    include: {
      purchases: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href={`/dashboard/courses`}
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          ← Voltar para o curso
        </Link>
        <h1 className="text-2xl font-bold">Histórico de Vendas: {course.title}</h1>
      </div>

      <PurchaseHistory purchases={course.purchases} />
    </div>
  )
} 