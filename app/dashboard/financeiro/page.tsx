'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LISTpayments } from './payments/page'

export default function Financeiro() {
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const [pendingBalance, setPendingBalance] = useState(0)

  // Buscar saldo do usuário
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/user/balance')
        const data = await response.json()
        if (response.ok) {
          setBalance(data.balance)
          setPendingBalance(data.pendingBalance)
        }
      } catch (error) {
        console.error('Erro ao buscar saldo:', error)
      }
    }

    fetchBalance()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Financeiro</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card de Saldo Disponível */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="border-l-4 border-green-500 pl-4">
            <h2 className="text-gray-600 text-sm">Saldo disponível</h2>
            <p className="text-2xl font-semibold mt-1">
              {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}
            </p>
          </div>
        </div>

        {/* Card de Saldo Pendente */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="border-l-4 border-yellow-500 pl-4">
            <div className="flex items-center">
              <h2 className="text-gray-600 text-sm">Saldo pendente</h2>
              <span className="ml-2 text-gray-400 hover:text-gray-600 cursor-help" title="Valor em processamento de saques pendentes">
                ⓘ
              </span>
            </div>
            <p className="text-2xl font-semibold mt-1">
              {pendingBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}
            </p>
          </div>
        </div>
      </div>

      {/* Botão de Saque */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => router.push('/dashboard/financeiro/payments')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Efetuar saque
        </button>
      </div>

      {/* Histórico de Saques */}
      <div className="bg-white rounded-lg shadow p-6">
        <LISTpayments />
      </div>
    </div>
  )
} 