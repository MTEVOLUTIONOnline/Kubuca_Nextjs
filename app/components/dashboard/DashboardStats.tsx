'use client'
import { useEffect, useState } from 'react'
import { FiDollarSign, FiUsers, FiBookOpen } from 'react-icons/fi'

type DashboardStats = {
  totalStudents: number
  totalCourses: number
  totalRevenue: number
  totalAffiliateEarnings: number
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
    totalAffiliateEarnings: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      }
    }

    fetchStats()
  }, [])

  const totalEarnings = stats.totalRevenue + stats.totalAffiliateEarnings

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <FiUsers className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total de Alunos</p>
            <p className="text-lg font-semibold text-gray-900">{stats.totalStudents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-full">
            <FiBookOpen className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total de Cursos</p>
            <p className="text-lg font-semibold text-gray-900">{stats.totalCourses}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 rounded-full">
            <FiDollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Vendas Diretas</p>
            <p className="text-lg font-semibold text-gray-900">
              {stats.totalRevenue.toLocaleString('pt-PT', {
                style: 'currency',
                currency: 'MZN'
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-2 border-indigo-100">
        <div className="flex items-center">
          <div className="p-3 bg-indigo-100 rounded-full">
            <FiDollarSign className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Receita Total</p>
            <p className="text-lg font-semibold text-gray-900">
              {totalEarnings.toLocaleString('pt-PT', {
                style: 'currency',
                currency: 'MZN'
              })}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Vendas + Afiliados: {stats.totalAffiliateEarnings.toLocaleString('pt-PT', {
                style: 'currency',
                currency: 'MZN'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 