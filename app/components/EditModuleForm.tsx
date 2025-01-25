'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Module = {
  id: string
  title: string
  description: string
}

export default function EditModuleForm({ 
  module,
  courseId 
}: { 
  module: Module
  courseId: string
}) {
  const router = useRouter()
  const [title, setTitle] = useState(module.title)
  const [description, setDescription] = useState(module.description)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/modules/${module.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        }),
      })

      if (response.ok) {
        router.push(`/dashboard/courses/${courseId}/modules`)
        router.refresh()
      } else {
        alert('Erro ao atualizar o módulo')
      }
    } catch (error) {
      console.error('Erro ao atualizar módulo:', error)
      alert('Erro ao atualizar o módulo')
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2">Título do Módulo</label>
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

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/courses/${courseId}/modules`)}
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