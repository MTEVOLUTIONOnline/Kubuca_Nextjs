import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '../components/navbar'


export default async function MarketplacePage() {
  const courses = await prisma.course.findMany({
    include: {
      instructor: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          modules: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Cursos Disponíveis</h1>
          <Link href="/dashboard/marketplace" className="text-gray-600 hover:text-gray-900">
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/marketplace/courses/${course.id}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {course.imageUrl ? (
                <div className="relative h-64 rounded-sm overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${course.imageUrl}`}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                  {course.title}
                </h2>

                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <p>Por {course.instructor.name || 'Instrutor'}</p>
                    <p>{course._count.modules} módulos</p>
                  </div>

                  <p className="text-lg font-bold text-green-600">
                    {course.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'MZN'
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum curso disponível no momento.</p>
          </div>
        )}
      </div>
    </div>
  )
} 