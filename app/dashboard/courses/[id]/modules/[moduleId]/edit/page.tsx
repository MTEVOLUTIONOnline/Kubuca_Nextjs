import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditModuleForm from '@/app/components/EditModuleForm'
import Link from 'next/link'


export default async function EditModulePage({
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
        id: params.id,
        instructorId: user.id,
      },
    },
  })

  if (!module) {
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
      <h1 className="text-2xl font-bold mb-6">Editar Módulo</h1>
      <EditModuleForm module={module} courseId={params.id} />
    </div>
  )
} 