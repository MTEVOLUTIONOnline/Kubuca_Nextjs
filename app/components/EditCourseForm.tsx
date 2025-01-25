'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Course = {
  id: string
  title: string
  description: string
  imageUrl: string
  price: number
}

export default function EditCourseForm({ course }: { course: Course }) {
  const router = useRouter()
  const [title, setTitle] = useState(course.title)
  const [description, setDescription] = useState(course.description)
  const [price, setPrice] = useState(course.price.toString())
  const [image, setImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = async (file: File) => {
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
      let imageUrl = course.imageUrl
      if (image) {
        imageUrl = await handleImageUpload(image)
      }

      const response = await fetch(`/api/courses/${course.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price: parseFloat(price),
        }),
      })

      if (response.ok) {
        router.push('/dashboard/courses')
        router.refresh()
      } else {
        alert('Erro ao atualizar o curso')
      }
    } catch (error) {
      console.error('Erro ao atualizar curso:', error)
      alert('Erro ao atualizar o curso')
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2">Título do Curso</label>
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
        <label htmlFor="price" className="block mb-2">Preço do Curso (R$)</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label htmlFor="image" className="block mb-2">Nova Imagem do Curso (opcional)</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
        />
      </div>

      {course.imageUrl && (
        <div>
          <p className="mb-2">Imagem atual:</p>
          <img
            src={process.env.NEXT_PUBLIC_BACKEND_URL+ "/" + course.imageUrl} 
            alt="Imagem atual do curso"
            className="w-48 h-48 object-cover rounded"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </form>
  )
} 