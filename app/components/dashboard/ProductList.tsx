'use client'

import Link from 'next/link'
import { Course } from '@prisma/client'

type CourseWithStats = Course & {
  _count: {
    purchases: number
  }
  purchases: {
    amount: number
  }[]
}

export default function ProductList({ courses }: { courses: CourseWithStats[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {courses.map((course) => {
        const totalRevenue = course.purchases.reduce((sum, purchase) => 
          sum + purchase.amount, 0
        )

        return (
          <div key={course.id} className="bg-white shadow-md overflow-hidden">
            {course.imageUrl && (
              <div className="h-64 overflow-hidden">
                <img
                  src={process.env.NEXT_PUBLIC_BACKEND_URL+"/"+course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Vendas</p>
                  <p className="text-lg font-semibold">
                    {course._count.purchases}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Receita</p>
                  <p className="text-lg font-semibold text-green-600">
                    {totalRevenue.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Link
                  href={`/dashboard/products/courses/${course.id}/modules`}
                  className="flex-1 bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  Gerenciar
                </Link>
                <Link
                  href={`/dashboard/products/courses/${course.id}/purchases`}
                  className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded hover:bg-gray-200 transition"
                >
                  Vendas
                </Link>
              </div>
            </div>
          </div>
        )
      })}

      <Link
        href="/dashboard/products/add"
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition"
      >
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <span className="text-gray-600">Criar Novo Produto</span>
      </Link>
    </div>
  )
} 