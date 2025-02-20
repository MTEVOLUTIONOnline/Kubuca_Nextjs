'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ModuleForm({ courseId }: { courseId: string }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          courseId,
        }),
      })

      if (response.ok) {
        router.push(`/dashboard/products/courses/${courseId}/modules`)
        router.refresh()
      }
    } catch (error) {
      console.error('Erro ao criar módulo:', error)
    }
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

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Criar Módulo
      </button>
    </form>
  )
} 