'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { fazerPagamentoMpesa, fazerPagamentoEmola } from '@/utils/mpesa'

type Course = {
  id: string
  title: string
  price: number
}

type PaymentMethod = 'mpesa' | 'emola'

export default function PaymentMethods({ course }: { course: Course }) {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mpesa')
  const [isProcessing, setIsProcessing] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      let response;
      
      if (selectedMethod === 'mpesa') {
        response = await fazerPagamentoMpesa({
          phone: phoneNumber,
          amount: course.price,
          courseId: course.id
        })
      } else if (selectedMethod === 'emola') {
        response = await fazerPagamentoEmola({
          phone: phoneNumber,
          amount: course.price,
          courseId: course.id
        })
      }

      if (response?.success) {
        router.push(`/payment/success?courseId=${course.id}`)
      } else {
        alert(response?.message || `Erro ao processar pagamento ${selectedMethod.toUpperCase()}`)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      console.error('Erro:', errorMessage)
      alert(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Método de Pagamento</h2>

      <div className="space-y-4">
        <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="mpesa"
            checked={selectedMethod === 'mpesa'}
            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
            className="mr-3"
          />
          <div>
            <span className="font-medium">M-Pesa</span>
            <p className="text-sm text-gray-500">Pague com M-Pesa</p>
          </div>
        </label>

        <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="emola"
            checked={selectedMethod === 'emola'}
            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
            className="mr-3"
          />
          <div>
            <span className="font-medium">E-mola</span>
            <p className="text-sm text-gray-500">Pague com E-mola</p>
          </div>
        </label>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Telefone {selectedMethod.toUpperCase()}
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Ex: +258 84/86 XXX XXXX"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing || !phoneNumber}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isProcessing ? 'Processando...' : 'Finalizar Compra'}
        </button>
      </div>
    </div>
  )
} 