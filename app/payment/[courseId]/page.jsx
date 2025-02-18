'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PaymentMethods from '@/app/components/payment/PaymentMethods'
import PaymentSummary from '@/app/components/payment/PaymentSummary'

export default function PaymentPage({ params }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) {
      router.push('/login')
      return
    }

    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${params.courseId}`)
        if (!res.ok) throw new Error('Curso não encontrado')

        const data = await res.json()
        setCourse(data)
      } catch (error) {
        router.push('/404')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [session, status, params.courseId, router])

  if (loading) {
    return <div className="text-center py-20">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Resumo da compra */}
            <div className="md:col-span-2">
              <PaymentSummary course={course} />
            </div>

            {/* Métodos de pagamento */}
            <div className="md:col-span-1">
              <PaymentMethods course={course} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
