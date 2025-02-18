import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ModuleList from '@/app/components/ModuleList'
import { notFound } from 'next/navigation'

// Removido o tipo de parâmetros
export default async function CourseModulesPage({ params }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <div>Acesso negado</div>
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
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
    include: {
      modules: {
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link 
          href={`/dashboard/products/courses`}
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          ← Voltar para curso
        </Link>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Módulos do Curso: {course.title}</h1>
          <p className="text-gray-600 mt-1">{course.description}</p>
        </div>
        <Link 
          href={`/dashboard/products/courses/${course.id}/modules/create`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Adicionar Módulo
        </Link>
      </div>
      <ModuleList modules={course.modules} courseId={course.id} />
    </div>
  )
}