'use client'
import { useState } from 'react'

type PortfolioStats = {
  balance: number
  totalEarnings: number
  creatorEarnings: number
  affiliateEarnings: number
  minimumWithdraw: number
}

export default function PortfolioStats({ portfolio }: { portfolio: PortfolioStats }) {
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'MZN'
    })
  }

  const handleWithdraw = async () => {
    setIsWithdrawing(true)
    try {
      // Implementar lógica de saque aqui
      alert('Funcionalidade de saque em desenvolvimento')
    } catch (error) {
      console.error('Erro ao processar saque:', error)
    }
    setIsWithdrawing(false)
  }

  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
      {/* Saldo Disponível */}
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="mb-2 text-sm font-medium text-gray-600">Saldo Disponível</p>
            <p className="text-lg font-semibold text-gray-700">
              {formatCurrency(portfolio.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Ganhos Totais */}
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="mb-2 text-sm font-medium text-gray-600">Ganhos Totais</p>
            <p className="text-lg font-semibold text-gray-700">
              {formatCurrency(portfolio.totalEarnings)}
            </p>
          </div>
        </div>
      </div>

      {/* Ganhos como Instrutor */}
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="mb-2 text-sm font-medium text-gray-600">Ganhos como Instrutor</p>
            <p className="text-lg font-semibold text-gray-700">
              {formatCurrency(portfolio.creatorEarnings)}
            </p>
          </div>
        </div>
      </div>

      {/* Ganhos como Afiliado */}
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="mb-2 text-sm font-medium text-gray-600">Ganhos como Afiliado</p>
            <p className="text-lg font-semibold text-gray-700">
              {formatCurrency(portfolio.affiliateEarnings)}
            </p>
          </div>
        </div>
      </div>

      {/* Botão de Saque */}
      <div className="col-span-full">
        <button
          onClick={handleWithdraw}
          disabled={isWithdrawing || portfolio.balance < portfolio.minimumWithdraw}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isWithdrawing ? 'Processando...' : 'Solicitar Saque'}
        </button>
        
        {portfolio.balance < portfolio.minimumWithdraw && (
          <p className="mt-2 text-sm text-gray-500 text-center">
            Saldo mínimo para saque: {formatCurrency(portfolio.minimumWithdraw)}
          </p>
        )}
      </div>
    </div>
  )
} 