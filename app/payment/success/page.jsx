import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

// Removido o tipo de parâmetros
export default async function PaymentSuccessPage({ searchParams }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <div>Acesso negado</div>
  }

  const course = await prisma.course.findUnique({
    where: {
      id: searchParams.courseId,
    },
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-4">Pagamento Confirmado!</h1>
        <p className="text-gray-600 mb-6">
          Seu pagamento foi processado com sucesso. Você já pode começar a assistir o curso.
        </p>

        <div className="space-y-4">
          <Link
            href={`/dashboard/my-courses/${course.id}`}
            className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Começar a Assistir
          </Link>
          
          <Link
            href="/dashboard/my-courses"
            className="block w-full text-blue-500 hover:underline"
          >
            Ver Todos os Meus Cursos
          </Link>
        </div>
      </div>
    </div>
  )
}