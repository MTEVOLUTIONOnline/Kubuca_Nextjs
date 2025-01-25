import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import LessonForm from '@/app/components/LessonForm'

export default async function CreateLessonPage({
  params,
}: {
  params: { id: string; moduleId: string }
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

  const module = await prisma.module.findFirst({
    where: {
      id: params.moduleId,
      course: {
        instructorId: user.id,
      },
    },
    include: {
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
      <h1 className="text-2xl font-bold mb-6">
        Adicionar Aula ao Módulo: {module.title}
      </h1>
      <p className="text-gray-600 mb-6">Curso: {module.course.title}</p>
      <LessonForm 
        courseId={params.id} 
        moduleId={module.id} 
      />
    </div>
  )
} 