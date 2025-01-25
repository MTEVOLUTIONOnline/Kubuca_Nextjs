'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

type PurchaseButtonProps = {
  courseId: string
}

export default function PurchaseButton({ courseId }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handlePurchase = async () => {
    if (!session) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    setIsLoading(true)
    try {
      // Verificar se o usuário já comprou o curso
      const checkResponse = await fetch(`/api/purchases/check/${courseId}`)
      const checkData = await checkResponse.json()

      if (checkData.hasPurchased) {
        router.push(`/dashboard/my-courses/${courseId}`)
        return
      }

      // Redirecionar para a página de pagamento
      router.push(`/payment/${courseId}`)
    } catch (error) {
      console.error('Erro ao verificar compra:', error)
      alert('Erro ao processar a solicitação')
    }
    setIsLoading(false)
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={isLoading}
      className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
    >
      {isLoading ? 'Processando...' : 'Comprar Curso'}
    </button>
  )
} 