'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Lesson = {
  id: string
  title: string
  description: string
  videoUrl: string | null
}

export default function LessonList({ 
  lessons, 
  courseId,
  moduleId 
}: { 
  lessons: Lesson[]
  courseId: string
  moduleId: string
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Erro ao excluir a aula')
      }
    } catch (error) {
      console.error('Erro ao excluir aula:', error)
      alert('Erro ao excluir a aula')
    }
    setIsDeleting(false)
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Este módulo ainda não tem aulas.</p>
        <Link 
          href={`/dashboard/courses/${courseId}/modules/${moduleId}/lessons/create`}
          className="text-blue-500 hover:underline mt-2 inline-block"
        >
          Criar primeira aula
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{lesson.title}</h3>
              <p className="text-gray-600 mt-1">{lesson.description}</p>
              {lesson.videoUrl && (
                <div className="mt-2">
                  <video 
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${lesson.videoUrl}`}
                    className="w-64 rounded"
                    controls
                  />
                </div>
              )}
            </div>
            <div className="space-x-2">
              <Link
                href={`/dashboard/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/edit`}
                className="text-blue-500 hover:underline"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(lesson.id)}
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