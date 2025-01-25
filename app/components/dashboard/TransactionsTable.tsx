'use client'
import { useState } from 'react'

type Transaction = {
  id: string
  amount: number
  status: string
  createdAt: Date
  creatorEarnings: number | null
  affiliateEarnings: number | null
  course: {
    title: string
    instructor: {
      name: string | null
    }
  }
  user: {
    name: string | null
    email: string
  }
  affiliate: {
    user: {
      name: string | null
    }
  } | null
}

type TransactionsTableProps = {
  transactions: Transaction[]
  currentUserId: string
}

export default function TransactionsTable({ transactions, currentUserId }: TransactionsTableProps) {
  const [filter, setFilter] = useState<'all' | 'sales' | 'purchases' | 'affiliate'>('all')

  const filteredTransactions = transactions.filter(transaction => {
    switch (filter) {
      case 'sales':
        return transaction.creatorEarnings && transaction.creatorEarnings > 0
      case 'purchases':
        return transaction.user.email === currentUserId
      case 'affiliate':
        return transaction.affiliateEarnings && transaction.affiliateEarnings > 0
      default:
        return true
    }
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(date))
  }

  const getTransactionType = (transaction: Transaction) => {
    if (transaction.creatorEarnings && transaction.creatorEarnings > 0) return 'Venda'
    if (transaction.affiliateEarnings && transaction.affiliateEarnings > 0) return 'Comissão de Afiliado'
    return 'Compra'
  }

  const getAmount = (transaction: Transaction) => {
    if (transaction.creatorEarnings && transaction.creatorEarnings > 0) return transaction.creatorEarnings
    if (transaction.affiliateEarnings && transaction.affiliateEarnings > 0) return transaction.affiliateEarnings
    return transaction.amount
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Transações</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="p-2 border rounded"
          >
            <option value="all">Todas</option>
            <option value="sales">Vendas</option>
            <option value="purchases">Compras</option>
            <option value="affiliate">Comissões</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso
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
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getTransactionType(transaction)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {transaction.course.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    por {transaction.course.instructor.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    {getAmount(transaction).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'MZN'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status === 'completed' ? 'Concluída' : 'Pendente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma transação encontrada
          </div>
        )}
      </div>
    </div>
  )
} 