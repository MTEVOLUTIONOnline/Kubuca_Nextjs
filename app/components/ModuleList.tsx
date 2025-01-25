'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Module = {
  id: string
  title: string
  description: string
}

export default function ModuleList({ 
  modules, 
  courseId 
}: { 
  modules: Module[]
  courseId: string 
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (moduleId: string) => {
    if (!confirm('Tem certeza que deseja excluir este módulo?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Erro ao excluir o módulo')
      }
    } catch (error) {
      console.error('Erro ao excluir módulo:', error)
      alert('Erro ao excluir o módulo')
    }
    setIsDeleting(false)
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Este curso ainda não tem módulos.</p>
        <Link 
          href={`/dashboard/courses/${courseId}/modules/create`}
          className="text-blue-500 hover:underline mt-2 inline-block"
        >
          Criar primeiro módulo
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <div key={module.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{module.title}</h3>
              <p className="text-gray-600 mt-1">{module.description}</p>
            </div>
            <div className="space-x-2">
              <Link
                href={`/dashboard/courses/${courseId}/modules/${module.id}/edit`}
                className="text-blue-500 hover:underline"
              >
                Editar
              </Link>
              <Link
                href={`/dashboard/courses/${courseId}/modules/${module.id}/lessons`}
                className="text-green-500 hover:underline"
              >
                Aulas
              </Link>
              <button
                onClick={() => handleDelete(module.id)}
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