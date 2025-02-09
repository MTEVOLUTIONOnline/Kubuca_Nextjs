'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

type EbookActionsProps = {
  ebookId: string
  hasPurchased: boolean
}

// NEXT_PUBLIC_BACKEND_URL
export default function EbookActions({ 
  ebookId, 
  hasPurchased 
}: EbookActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePurchase = () => {
    router.push(`/payment/${ebookId}`)
  }

  const handleAffiliate = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/affiliate/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ebookId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao se tornar afiliado')
      }

      toast.success('Você agora é um afiliado deste eBook!')
      router.refresh()
    } catch (error) {
      console.error('Erro:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao se tornar afiliado')
    } finally {
      setLoading(false)
    }
  }

  if (hasPurchased) {
    return (
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <p className="text-green-600 font-medium">Você já comprou este eBook</p>
        <button
          onClick={() => router.push(`/dashboard/my-ebooks/${ebookId}`)}
          className="mt-2 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Acessar eBook
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
        Comprar eBook
      </button>

      <button
        onClick={handleAffiliate}
        disabled={loading}
        className="w-full border-2 border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-50 transition disabled:opacity-50"
      >
        {loading ? 'Processando...' : 'Tornar-se Afiliado'}
      </button>
    </div>
  )
} 