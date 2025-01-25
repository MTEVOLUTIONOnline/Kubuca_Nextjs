import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ModuleForm from '@/app/components/ModuleForm'
import Link from 'next/link'
export default async function CreateModulePage({
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
          href={`/dashboard/courses/${params.id}/modules`}
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          ← Voltar para módulos
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">Adicionar Módulo ao Curso: {course.title}</h1>
      <ModuleForm courseId={course.id} />
    </div>
  )
} 