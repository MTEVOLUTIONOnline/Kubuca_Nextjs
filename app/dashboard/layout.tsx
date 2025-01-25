'use client'
import { useState } from 'react'
import DashboardSidebar from '@/app/components/dashboard/DashboardSidebar'
import { Menu, X } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botão de toggle para mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-2 left-2 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden"
      >
        {sidebarOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600" />
        )}
      </button>

      <div className="flex">
        {/* Sidebar Fixo */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-sm transition-transform duration-200 ease-in-out lg:translate-x-0 z-40`}
        >
          <DashboardSidebar />
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Conteúdo principal */}
        <main className={`flex-1 w-full min-h-screen transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'lg:pl-64' : ''
        }`}>
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 