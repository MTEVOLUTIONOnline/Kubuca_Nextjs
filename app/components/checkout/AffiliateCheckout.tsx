'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

type CheckoutProps = {
  course: {
    id: string
    title: string
    description: string
    price: number
    imageUrl: string
    instructor: {
      name: string
    }
  }
  affiliateData?: {
    code: string
    name: string
  } | null
}

export default function AffiliateCheckout({ course, affiliateData }: CheckoutProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'emola'>('mpesa')
  const [phoneNumber, setPhoneNumber] = useState('')

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast.error('Por favor, insira o número de telefone')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/payments/mpesa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          phone: phoneNumber,
          amount: course.price,
          method: selectedMethod,
          affiliateCode: affiliateData?.code
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/payment/success?courseId=${course.id}`)
      } else {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex gap-6 mb-6">
              {course.imageUrl && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${course.imageUrl}`}
                  alt={course.title}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-gray-600">Instrutor: {course.instructor.name}</p>
                {affiliateData && (
                  <p className="text-sm text-gray-500 mt-2">
                    Indicado por: {affiliateData.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Método de Pagamento</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="mpesa"
                      checked={selectedMethod === 'mpesa'}
                      onChange={(e) => setSelectedMethod(e.target.value as 'mpesa' | 'emola')}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium">M-Pesa</span>
                      <p className="text-sm text-gray-500">Pague com M-Pesa</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="emola"
                      checked={selectedMethod === 'emola'}
                      onChange={(e) => setSelectedMethod(e.target.value as 'mpesa' | 'emola')}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium">E-mola</span>
                      <p className="text-sm text-gray-500">Pague com E-mola</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Telefone {selectedMethod.toUpperCase()}
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Ex: +258 84/86 XXX XXXX"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between mb-4">
                  <span>Preço do curso</span>
                  <span>{course.price.toLocaleString('pt-PT', {
                    style: 'currency',
                    currency: 'MZN'
                  })}</span>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !phoneNumber}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isProcessing ? 'Processando...' : 'Finalizar Compra'}
                </button>

                <p className="mt-4 text-sm text-center text-gray-500">
                  Ao finalizar a compra você terá acesso imediato ao curso
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 