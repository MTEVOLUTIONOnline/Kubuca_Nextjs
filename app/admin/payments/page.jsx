'use client'

import { useState, useEffect, useCallback } from 'react'
import { FiSearch,  FiFilter } from 'react-icons/fi'
import { Toaster, toast } from 'react-hot-toast'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const itemsPerPage = 10

  const fetchPayments = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/payments?page=${currentPage}&limit=${itemsPerPage}&status=${filter}&search=${search}`
      )
      const data = await response.json()
      setPayments(data.payments)
      setTotalPages(Math.ceil(data.total / itemsPerPage))
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error)
      setLoading(false)
    }
  }, [currentPage, filter, search, itemsPerPage])

  useEffect(() => {
    fetchPayments()
  }, [currentPage, filter, search, fetchPayments])

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status')
      }

      await fetchPayments()
      toast.success('Status atualizado com sucesso')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar status do pagamento')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      <div className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">Gerenciar Saques</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Filtro de Status */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos</option>
                <option value="PENDING">Pendentes</option>
                <option value="COMPLETED">Aprovados</option>
                <option value="REJECTED">Rejeitados</option>
              </select>
            </div>

            {/* Busca */}
            <div className="relative flex-1 sm:flex-initial">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou número..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Solicitado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Final</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">M-Pesa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.user.name}</div>
                    <div className="text-sm text-gray-500">{payment.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-400">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.mpesaName}</div>
                    <div className="text-sm text-gray-500">{payment.mpesaNumber}</div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {payment.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(payment.id, 'COMPLETED')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => handleStatusChange(payment.id, 'REJECTED')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Rejeitar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between">
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
            </div>
          )}
        </div>
      </div>
      
      <Toaster position="top-right" />
    </>
  )
}
