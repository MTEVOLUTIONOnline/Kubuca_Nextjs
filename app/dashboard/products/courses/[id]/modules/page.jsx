import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ModuleList from '@/app/components/ModuleList'
import ModuleForm from '@/app/components/ModuleForm'
import Link from 'next/link'

export default async function CoursePage({ params }) {
  // Aguardar a sessão
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  // Buscar usuário e curso simultaneamente para melhor performance
  const [user, course] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: session.user.id
      }
    }),
    prisma.course.findUnique({
      where: {
        id: params.id,
        instructorId: session.user.id, // Usar direto o ID da sessão
      },
      include: {
        modules: {
          include: {
            lessons: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })
  ])

  if (!user || !course) {
    redirect('/dashboard/products/courses')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link 
            href="/dashboard/products/courses" 
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Voltar para cursos
          </Link>
          <h1 className="text-2xl font-bold">Módulos do Curso: {course.title}</h1>
          <p className="text-gray-500">Gerencie os módulos do seu curso</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Adicionar Novo Módulo</h2>
          <ModuleForm courseId={course.id} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Módulos Existentes</h2>
          <ModuleList modules={course.modules} courseId={course.id} />
        </div>
      </div>
    </div>
  )
}