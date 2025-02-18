import { authOptions } from '@/app/api/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import CourseList from '@/app/components/CourseList'
import { prisma } from '@/lib/prisma'
import { Plus } from 'lucide-react'

export default async function CoursesPage() {
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

  const courses = await prisma.course.findMany({
    where: {
      instructorId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Cursos</h1>
        <Link 
          href="/dashboard/products/courses/create" 
          className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-600/10 hover:text-blue-600 flex items-center"
        >
           <Plus className="w-4 h-4 mr-2" /> Criar Curso
        </Link>
      </div>
      <CourseList courses={courses} />
    </div>
  )
}
