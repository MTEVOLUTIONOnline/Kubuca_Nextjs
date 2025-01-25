'use client'
import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'
import { Course } from '@prisma/client'

type CourseWithDetails = Course & {
  instructor: {
    name: string | null
  }
}

export default function MarketplaceList({ 
  courses 
}: { 
  courses: CourseWithDetails[] 
}) {
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar cursos baseado no termo de pesquisa
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Marketplace de Afiliados</h1>
      <div className="flex justify-between items-center mb-8">
        {/* Campo de Pesquisa */}

        <div className="relative flex-1 max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar cursos, instrutores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <button className="ml-4 px-4 py-2 flex items-center text-gray-600 hover:text-gray-900">
          <span className="mr-2">Filtros</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>

      {/* Resultados da Pesquisa */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum curso encontrado para "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            // /dashboard/marketplace/[courseId]
            <Link href={`/dashboard/marketplace/${course.id}`} key={course.id}>
              <div className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {course.imageUrl && (
                  <div className="relative h-64 w-full">
                    <Image
                      src={process.env.NEXT_PUBLIC_BACKEND_URL+"/"+course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">Por {course.instructor.name}</p>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Receba até</p>
                    <p className="text-lg font-semibold text-green-600">
                      {((course.price * course.affiliateCommission) / 100).toLocaleString('pt-PT', {
                        style: 'currency',
                        currency: 'MZN'
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      Preço máximo do produto: {course.price.toLocaleString('pt-PT', {
                        style: 'currency',
                        currency: 'MZN'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 