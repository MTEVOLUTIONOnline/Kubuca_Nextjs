
import { authOptions } from '@/app/api/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import EditCourseForm from '@/app/components/EditCourseForm'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
export default async function EditCoursePage({
  params,
}: {
  params: { id: string }
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
      id: params.id,
      instructorId: user.id,
    },
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link 
          href={`/dashboard/products/courses/${params.id}/modules`}
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          ← Voltar para módulos
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">Editar Curso</h1>
      <EditCourseForm course={course} />
    </div>
  )
} 