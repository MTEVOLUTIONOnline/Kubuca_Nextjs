'use client'
import { useEffect, useState } from 'react'

export default function AdminStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div>Carregando estatísticas...</div>
  }

  if (!stats) {
    return <div>Erro ao carregar estatísticas</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Total de Usuários</h3>
        <p className="text-2xl font-bold">{stats.totalUsers}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Total de Cursos</h3>
        <p className="text-2xl font-bold">{stats.totalCourses}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Total de Vendas</h3>
        <p className="text-2xl font-bold">{stats.totalSales}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Receita Total</h3>
        <p className="text-2xl font-bold">
          R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
} 