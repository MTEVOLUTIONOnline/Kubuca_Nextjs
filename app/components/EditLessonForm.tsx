'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Lesson = {
  id: string
  title: string
  description: string
  videoUrl: string | null
}

export default function EditLessonForm({ 
  lesson,
  courseId,
  moduleId 
}: { 
  lesson: Lesson
  courseId: string
  moduleId: string
}) {
  const router = useRouter()
  const [title, setTitle] = useState(lesson.title)
  const [description, setDescription] = useState(lesson.description)
  const [video, setVideo] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleVideoUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    return data.fileUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let videoUrl = lesson.videoUrl
      if (video) {
        videoUrl = await handleVideoUpload(video)
      }

      const response = await fetch(`/api/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
        }),
      })

      if (response.ok) {
        router.push(`/dashboard/products/courses/${courseId}/modules/${moduleId}/lessons`)
        router.refresh()
      } else {
        alert('Erro ao atualizar a aula')
      }
    } catch (error) {
      console.error('Erro ao atualizar aula:', error)
      alert('Erro ao atualizar a aula')
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2">Título da Aula</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-2">Descrição</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="video" className="block mb-2">Novo Vídeo da Aula (opcional)</label>
        <input
          type="file"
          id="video"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
        />
      </div>

      {lesson.videoUrl && (
        <div>
          <p className="mb-2">Vídeo atual:</p>
          <video
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${lesson.videoUrl}`}
            className="w-64 rounded"
            controls
          />
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/courses/${courseId}/modules/${moduleId}/lessons`)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  )
} 