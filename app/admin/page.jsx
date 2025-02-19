'use client'
import { useSession } from 'next-auth/react'
// import AdminStats from '@/components/admin/AdminStats'
// import AdminUsersList from '@/components/admin/AdminUsersList'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FiUsers, FiDollarSign, FiShoppingCart, FiActivity, FiTrendingUp, FiClock } from 'react-icons/fi'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  if (session?.user?.role !== 'ADMIN') {
    return redirect('/dashboard')
  }

  console.log('Session:', session)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Administrativo</h1>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Usuários */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Usuários</p>
              <h3 className="text-2xl font-semibold">{stats?.totalUsers || 0}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Ativos: {stats?.activeUsers || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Saldo Total */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Saldo Total dos Usuários</p>
              <h3 className="text-2xl font-semibold">
                {(stats?.totalBalance || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Média por usuário: {(stats?.averageBalance || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Saques */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Saques Pendentes</p>
              <h3 className="text-2xl font-semibold">{stats?.pendingWithdrawals || 0}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Total: {(stats?.totalWithdrawalsAmount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos e Estatísticas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades Recentes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            {stats?.recentActivities?.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-2"></div>
                <div>
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas de Vendas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas de Vendas</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vendas Hoje</span>
              <span className="font-semibold">
                {(stats?.todaySales || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vendas este Mês</span>
              <span className="font-semibold">
                {(stats?.monthSales || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total de Vendas</span>
              <span className="font-semibold">
                {(stats?.totalSales || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 