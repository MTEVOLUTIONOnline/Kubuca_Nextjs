'use client'
import { useState } from 'react'

type Purchase = {
  id: string
  amount: number
  status: string
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
}

export default function PurchaseHistory({ purchases }: { purchases: Purchase[] }) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')
  
  const filteredPurchases = purchases.filter(purchase => {
    if (filter === 'all') return true
    return purchase.status === filter
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(date))
  }

  const totalRevenue = purchases
    .filter(p => p.status === 'completed')
    .reduce((sum, purchase) => sum + purchase.amount, 0)

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Resumo das Vendas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600">Total de Vendas</p>
            <p className="text-2xl font-bold">{purchases.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600">Vendas Concluídas</p>
            <p className="text-2xl font-bold">
              {purchases.filter(p => p.status === 'completed').length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-gray-600">Receita Total</p>
            <p className="text-2xl font-bold text-green-600">
              {totalRevenue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Histórico de Transações</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="p-2 border rounded"
            >
              <option value="all">Todas</option>
              <option value="completed">Concluídas</option>
              <option value="pending">Pendentes</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(purchase.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {purchase.user.name || 'Sem nome'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {purchase.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.amount.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      purchase.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {purchase.status === 'completed' ? 'Concluído' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 