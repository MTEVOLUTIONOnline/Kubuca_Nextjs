import Link from 'next/link'
import { Course } from '@prisma/client'

type CourseWithInstructor = Course & {
  instructor: {
    name: string | null
  }
  _count: {
    modules: number
  }
}

export default function CourseCard({ course }: { course: CourseWithInstructor }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {course.imageUrl && (
        <div className="relative h-48">
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${course.imageUrl}`}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            <p>Instrutor: {course.instructor.name || 'Não informado'}</p>
            <p>{course._count.modules} módulos</p>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {course.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </p>
        </div>

        <Link
          href={`/marketplace/courses/${course.id}`}
          className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  )
} 