import Link from 'next/link'
import { Course, Module } from '@prisma/client'

type CourseWithDetails = Course & {
  modules: (Module & {
    _count: {
      lessons: number
    }
  })[]
  instructor: {
    name: string | null
  }
}

export default function PurchasedCourseCard({
  course
}: {
  course: CourseWithDetails
}) {
  const totalLessons = course.modules.reduce(
    (total, module) => total + module._count.lessons,
    0
  )

  return (
    <div className="bg-white shadow-md overflow-hidden">
      <Link href={`/dashboard/my-courses/${course.id}`}>
        {course.imageUrl && (
          <div className="relative h-64">
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

          <div className="text-sm text-gray-500 mb-4">
            <p>Instrutor: {course.instructor.name || 'Não informado'}</p>
            <p>{course.modules.length} módulos</p>
            <p>{totalLessons} aulas</p>
          </div>

        </div>
      </Link>
    </div>
  )
} 