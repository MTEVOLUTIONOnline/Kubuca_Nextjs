'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

type CourseActionsProps = {
  courseId: string
  isAffiliated: boolean
  affiliateCode?: string
  hasPurchased: boolean
}

// NEXT_PUBLIC_BACKEND_URL
export default function CourseActions({ 
  courseId, 
  isAffiliated, 
  affiliateCode,
  hasPurchased 
}: CourseActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAffiliate = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/affiliate/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao se tornar afiliado')
      }

      toast.success('Você agora é um afiliado deste curso!')
      router.refresh()
    } catch (error) {
      console.error('Erro:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao se tornar afiliado')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = () => {
    router.push(`/payment/${courseId}`)
  }

  if (hasPurchased) {
    return (
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <p className="text-green-600 font-medium">Você já comprou este curso</p>
        <button
          onClick={() => router.push(`/dashboard/my-courses/${courseId}`)}
          className="mt-2 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Acessar Curso
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handlePurchase}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition"
      >
        Comprar Curso
      </button>

      {isAffiliated ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-green-600">
            Você é afiliado deste curso
          </p>
          <div className="relative">
            <input
              type="text"
              value={`${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?ref=${affiliateCode}`}
              readOnly
              className="w-full text-sm p-2 pr-20 border rounded bg-gray-50"
              onClick={(e) => e.currentTarget.select()}
            />
            {/* localhost:3000/courses/cm66em9yp0001uk14yzfw8p6q/checkout?ref=3RkHJCxGcR */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/checkout?ref=${affiliateCode}`
                )
                toast.success('Link copiado!')
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600"
            >
              Copiar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleAffiliate}
          disabled={loading}
          className="w-full border-2 border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-50 transition disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Tornar-se Afiliado'}
        </button>
      )}
    </div>
  )
} 