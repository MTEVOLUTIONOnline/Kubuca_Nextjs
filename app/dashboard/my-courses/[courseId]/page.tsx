import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CourseContent from '@/app/components/my-courses/CourseContent'

export default async function CourseView({
  params
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
    notFound()
  }

  // Verificar se o usuário comprou o curso
  const purchase = await prisma.purchase.findFirst({
    where: {
      userId: user.id,
      courseId: params.courseId,
      status: 'completed'
    },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  progress: {
                    where: {
                      userId: user.id
                    }
                  }
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
  })

  if (!purchase) {
    notFound()
  }

  const { course } = purchase

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/dashboard/my-courses"
        className="text-blue-500 hover:underline mb-6 inline-block"
      >
        ← Voltar para meus cursos
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-gray-600 mt-2">
          Instrutor: {course.instructor.name}
        </p>
      </div>

      <CourseContent course={course} />
    </div>
  )
} 