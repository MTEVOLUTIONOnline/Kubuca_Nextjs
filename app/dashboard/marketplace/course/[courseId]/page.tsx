import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import CourseActions from './CourseActions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CoursePage({ 
  params 
}: { 
  params: { courseId: string } 
}) {
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

  // Buscar o curso e a compra em uma única transação
  const [course, existingPurchase] = await Promise.all([
    prisma.course.findUnique({
      where: {
        id: params.courseId,
        affiliateCommission: {
          gt: 0 // Apenas cursos com programa de afiliados
        }
      },
      include: {
        instructor: {
          select: {
            name: true,
            email: true
          }
        },
        modules: {
          include: {
            lessons: true
          }
        },
        affiliates: {
          where: {
            userId: user.id
          }
        }
      }
    }),
    prisma.purchase.findFirst({
      where: {
        userId: user.id,
        courseId: params.courseId,
        status: 'completed'
      }
    })
  ])

  if (!course) {
    redirect('/dashboard/marketplace')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botão Voltar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link 
          href="/dashboard/marketplace" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para o Marketplace
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cabeçalho do Curso */}
          <div className="relative h-96">
            <Image
              src={process.env.NEXT_PUBLIC_BACKEND_URL+"/"+course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
              <div className="px-8 text-white">
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl mb-2">Por {course.instructor.name}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Grid de 2 colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna da Esquerda - Detalhes do Curso */}
              <div className="lg:col-span-2">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Sobre o Curso</h2>
                  <p className="text-gray-600">{course.description}</p>

                  <h3 className="text-xl font-bold mt-8 mb-4">Conteúdo do Curso</h3>
                  <div className="space-y-4">
                    {course.modules.map((module) => (
                      <div key={module.id} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{module.title}</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {module.lessons.map((lesson) => (
                            <li key={lesson.id}>{lesson.title}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coluna da Direita - Preço e Ações */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">Preço do curso</p>
                    <p className="text-3xl font-bold">
                      {course.price.toLocaleString('pt-PT', {
                        style: 'currency',
                        currency: 'MZN'
                      })}
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-500">Comissão por venda</p>
                    <p className="text-2xl font-bold text-green-600">
                      {((course.price * course.affiliateCommission) / 100).toLocaleString('pt-PT', {
                        style: 'currency',
                        currency: 'MZN'
                      })}
                      <span className="text-sm text-gray-500 ml-1">
                        ({course.affiliateCommission}%)
                      </span>
                    </p>
                  </div>

                  <CourseActions 
                    courseId={course.id}
                    isAffiliated={course.affiliates.length > 0}
                    affiliateCode={course.affiliates[0]?.affiliateCode}
                    hasPurchased={!!existingPurchase}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 