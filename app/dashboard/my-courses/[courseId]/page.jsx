import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CourseContent from '@/app/components/my-courses/CourseContent'
import { authOptions } from '@/app/api/auth'

// Removido o tipo PageProps
export default async function CourseDetailsPage({ params }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  })

  if (!user) {
    redirect('/login')
  }

  // Verificar se o usuário tem acesso ao curso
  const purchase = await prisma.purchase.findFirst({
    where: {
      courseId: params.courseId,
      userId: user.id,
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
    redirect('/dashboard/my-courses')
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

// Removido o tipo PageProps
export async function generateMetadata({ params }) {
  const { courseId } = params
  return {
    title: `Curso - ${courseId}`
  }
}