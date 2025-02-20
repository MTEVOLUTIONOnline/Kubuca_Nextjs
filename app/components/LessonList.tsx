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
        {/* <Link 
          // href={`/dashboard/products/courses/${courseId}/modules/${moduleId}/lessons/create`}
          href={`/dashboard/products/courses/${courseId}/modules/${moduleId}/lessons/create`}
          className="text-blue-500 hover:underline mt-2 inline-block"
        > */}
          Criar primeira aula
        {/* </Link> */}
      </div>
    )
  }

  return (
<table className="w-full border-collapse border rounded-lg">
  <thead>
    <tr className="bg-gray-100">
      <th className="p-3 text-left">Título</th>
      <th className="p-3 text-left">Descrição</th>
      <th className="p-3 text-left">Vídeo</th>
      <th className="p-3 text-left">Ações</th>
    </tr>
  </thead>
  <tbody>
    {lessons.map((lesson) => (
      <tr key={lesson.id} className="border-t">
        <td className="p-3">{lesson.title}</td>
        <td className="p-3 text-gray-600">{lesson.description}</td>
        <td className="p-3">
          {lesson.videoUrl && (
            <video
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${lesson.videoUrl}`}
              className="w-32 rounded"
              controls
            />
          )}
        </td>
        <td className="p-3 space-x-2">
          <Link
            href={`/dashboard/products/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/edit`}
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
        </td>
      </tr>
    ))}
  </tbody>
</table>

  )
} 