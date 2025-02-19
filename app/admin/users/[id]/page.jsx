'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function UserDetails({ params }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 8

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/admin/users/${params.id}?page=${currentPage}&limit=${itemsPerPage}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao buscar detalhes do usuário')
      }
      
      const data = await response.json()
      setUser(data.user)
      setTotalPages(Math.ceil(data.totalActivities / itemsPerPage))
      setError(null)
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [currentPage])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Voltar
      </button>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between border-b pb-6">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl text-gray-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-semibold text-gray-900">{user?.name}</h1>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              user?.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {user?.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiUser className="text-gray-400 mr-2" />
                  <span className="text-gray-600">ID: {user?.id}</span>
                </div>
                <div className="flex items-center">
                  <FiMail className="text-gray-400 mr-2" />
                  <span className="text-gray-600">Email: {user?.email}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    Criado em: {new Date(user?.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center">
                  <FiClock className="text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    Último acesso: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('pt-BR') : 'Nunca'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Atividades</h2>
              {user?.activities?.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {user.activities.map((activity) => (
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

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
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
                            Página <span className="font-medium">{currentPage}</span> de{' '}
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
                </>
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma atividade registrada</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 