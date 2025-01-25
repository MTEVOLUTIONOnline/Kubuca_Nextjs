'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Course = {
  id: string
  title: string
  description: string
  imageUrl: string
  price: number
  createdAt: Date
}

export default function CourseList({ courses }: { courses: Course[] }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (courseId: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Erro ao excluir o curso')
      }
    } catch (error) {
      console.error('Erro ao excluir curso:', error)
      alert('Erro ao excluir o curso')
    }
    setIsDeleting(false)
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Você ainda não tem nenhum curso.</p>
        <Link 
          href="/dashboard/courses/create"
          className="text-blue-500 hover:underline mt-2 inline-block"
        >
          Criar meu primeiro curso
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="border overflow-hidden shadow-sm">
          {course.imageUrl && (
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${course.imageUrl}`}
              alt={course.title}
              width={200}
              height={200}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
            <p className="text-lg font-semibold text-green-600 mb-4">
              {course.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'MZN'
              })}
            </p>
            <div className="flex justify-between items-center">
              <div className="space-x-2">
                <Link
                  href={`/dashboard/courses/${course.id}/edit`}
                  className="text-blue-500 hover:underline"
                >
                  Editar
                </Link>
                <Link
                  href={`/dashboard/courses/${course.id}/modules`}
                  className="text-green-500 hover:underline"
                >
                  Módulos
                </Link>
              </div>
              <button
                onClick={() => handleDelete(course.id)}
                disabled={isDeleting}
                className="text-red-500 hover:underline disabled:opacity-50"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 