import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PaymentMethods from '@/app/components/payment/PaymentMethods'
import PaymentSummary from '@/app/components/payment/PaymentSummary'


export default async function PaymentPage({
  params,
}: {
  params: { courseId: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <div>Acesso negado</div>
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      instructor: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Resumo da compra */}
            <div className="md:col-span-2">
              <PaymentSummary course={course} />
            </div>

            {/* Métodos de pagamento */}
            <div className="md:col-span-1">
              <PaymentMethods course={course} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 