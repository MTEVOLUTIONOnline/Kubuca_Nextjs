import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth'
import { prisma } from '@/lib/prisma'
import CreatePLRForm from './CreatePLRForm'
import { redirect } from 'next/navigation'

export default async function PlrPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!
    }
  })

  if (!user) {
    redirect('/login')
  }
  
  // Buscar cursos do usuário
  const courses = await prisma.course.findMany({
    where: {
      instructorId: user.id
    },
    select: {
      id: true,
      title: true
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-8">Criar Novo PLR de Ebooks</h1>
        <CreatePLRForm courses={courses} />
      </div>
    </div>
  )
}