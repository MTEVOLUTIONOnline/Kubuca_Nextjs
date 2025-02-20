import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import LessonList from '@/app/components/LessonList'
import { notFound } from 'next/navigation'
import { authOptions } from '@/app/api/auth'

// Removido o tipo de parâmetros
export default async function ModuleLessonsPage({ params }) {
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

  const module = await prisma.module.findFirst({
    where: {
      id: params.moduleId,
      course: {
        instructorId: user.id,
      },
    },
    include: {
      lessons: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      course: {
        select: {
          title: true
        }
      }
    }
  })

  if (!module) {
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Aulas do Módulo: {module.title}</h1>
            <p className="text-gray-600 mt-1">Curso: {module.course.title}</p>
          </div>
          <Link 
            href={`/dashboard/products/courses/${params.id}/modules/${module.id}/lessons/create`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Adicionar Aula
          </Link>
        </div>
      </div>
      <LessonList 
        lessons={module.lessons} 
        courseId={params.id} 
        moduleId={module.id} 
      />
    </div>
  )
}