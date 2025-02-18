import { authOptions } from '@/app/api/auth'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditLessonForm from '@/app/components/EditLessonForm'

// Removido o tipo de parâmetros
export default async function EditLessonPage({ params }) {
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

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: params.lessonId,
      module: {
        id: params.moduleId,
        course: {
          instructorId: user.id,
        },
      },
    },
    include: {
      module: {
        select: {
          title: true,
          course: {
            select: {
              title: true
            }
          }
        }
      }
    }
  })

  if (!lesson) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Aula</h1>
        <p className="text-gray-600 mt-1">
          Módulo: {lesson.module.title} | Curso: {lesson.module.course.title}
        </p>
      </div>
      <EditLessonForm 
        lesson={lesson} 
        courseId={params.id} 
        moduleId={params.moduleId} 
      />
    </div>
  )
}