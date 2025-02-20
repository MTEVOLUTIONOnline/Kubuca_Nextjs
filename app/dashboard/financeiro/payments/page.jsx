'use client'

import { useState, useEffect } from 'react'
import { FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Payments() {
  const [loading, setLoading] = useState(false)
  const [balaceError, setBalaceError] = useState('')
  const [amount, setAmount] = useState('')
  const [withdrawalFee, setWithdrawalFee] = useState(10) // Taxa padrão de 10%
  const [finalAmount, setFinalAmount] = useState(0)
  const [feeAmount, setFeeAmount] = useState(0)
  const [userWithdrawalFee, setUserWithdrawalFee] = useState(null)

  const [formData, setFormData] = useState({
    mpesaName: '',
    mpesaNumber: ''
  })

  // Buscar a taxa do usuário e a taxa padrão
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        // Primeiro busca o usuário para ver se tem taxa personalizada
        const userResponse = await fetch('/api/users/me')
        const userData = await userResponse.json()
        
        // Se o usuário não tem taxa personalizada, busca a taxa padrão
        if (userData.withdrawalFee === null) {
          const settingsResponse = await fetch('/api/admin/settings')
          const settingsData = await settingsResponse.json()
          setWithdrawalFee(settingsData.withdrawalFee)
        } else {
          setWithdrawalFee(userData.withdrawalFee)
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error)
      }
    }
    fetchUserSettings()
  }, [])

  // Calcular valores quando o amount ou withdrawalFee mudar
  useEffect(() => {
    const value = parseFloat(amount) || 0
    const fee = (value * withdrawalFee) / 100
    const final = value - fee

    setFeeAmount(fee)
    setFinalAmount(final)
  }, [amount, withdrawalFee])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setBalaceError('')

    const value = parseFloat(amount)
    if (isNaN(value) || value <= 0) {
      setBalaceError('Por favor, insira um valor válido para o saque.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/payments/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: value,
          mpesaName: formData.mpesaName,
          mpesaNumber: formData.mpesaNumber,
          feeAmount,
          finalAmount,
          feePercentage: withdrawalFee
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao solicitar saque')
      }

      // Limpar formulário após sucesso
      setAmount('')
      setFormData({
        mpesaName: '',
        mpesaNumber: '',
      })
      setFinalAmount(0)
      setFeeAmount(0)

      alert('Solicitação de saque enviada com sucesso!')
    } catch (error) {
      console.error('Erro:', error)
      setBalaceError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Solicitar Saque</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Saque
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 w-full rounded-lg border border-gray-300 p-2"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome no M-Pesa / E-mola
              </label>
              <input
                type="text"
                required
                value={formData.mpesaName}
                onChange={(e) => setFormData({ ...formData, mpesaName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="Nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número M-Pesa
              </label>
              <input
                type="text"
                required
                value={formData.mpesaNumber}
                onChange={(e) => setFormData({ ...formData, mpesaNumber: e.target.value })}
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="Ex: +258 84 XXX XXXX"
              />
            </div>
          </div>

          {amount && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Taxa de saque: {withdrawalFee}% 
                {userWithdrawalFee !== null && <span className="text-xs text-gray-500 ml-2">(Taxa personalizada)</span>}
              </p>
              <p className="text-sm text-gray-600">
                Valor da taxa: MT {feeAmount.toFixed(2)}
              </p>
              <p className="font-medium">
                Valor final: MT {finalAmount.toFixed(2)}
              </p>
            </div>
          )}

          {balaceError && (
            <p className="text-red-500 mt-4">{balaceError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Solicitar Saque'}
          </button>
        </form>
      </div>

      <LISTpayments />
    </div>
  )
} 

export function LISTpayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 8

  const fetchPayments = async (page) => {
    try {
      const response = await fetch(`/api/payments?page=${page}&limit=${itemsPerPage}`)
      const data = await response.json()
      setPayments(data.payments)
      setTotalPages(Math.ceil(data.total / itemsPerPage))
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments(currentPage)
  }, [currentPage])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Saques</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Solicitado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Final</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">M-Pesa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.feeAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}
                    <span className="text-xs text-gray-400 ml-1">
                      ({payment.feePercentage}%)
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.finalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.mpesaNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {payment.status === 'COMPLETED' ? 'Aprovado' :
                        payment.status === 'PENDING' ? 'Pendente' :
                        payment.status === 'REJECTED' ? 'Rejeitado' :
                        payment.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhum saque encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando página <span className="font-medium">{currentPage}</span> de{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Próximo</span>
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}