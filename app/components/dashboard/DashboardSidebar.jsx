'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  GraduationCap,
  LogOut,
} from 'lucide-react'

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />
  },
  {
    label: 'Produtos',
    href: '/dashboard/products',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    label: 'Marketplace',
    href: '/dashboard/marketplace',
    icon: <ShoppingBag className="w-5 h-5" />
  },
  {
    label: 'Meus Estudos',
    href: '/dashboard/my-courses',
    icon: <GraduationCap className="w-5 h-5" />
  },
  {
    label: 'Meus Links',
    href: '/dashboard/affiliate/links',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  },
  {
    label: 'Transações',
    href: '/dashboard/transactions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    label: 'Financeiro',
    href: '/dashboard/financeiro',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    )
  }
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="h-full flex flex-col">
      {/* Logo/Título */}
      <div className="p-4 border-b">
        <Link href="/dashboard" className="text-lg font-bold text-gray-800">
          Kubuca
        </Link>
      </div>

      {/* Menu de navegação */}
      <nav className="flex-1 py-2">
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 mx-2 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            )
          })}
          {session?.user?.role === 'ADMIN' && (
            <li>
              <Link
                href="/admin"
                className="flex items-center space-x-2 px-3 py-2 mx-2 rounded-lg transition text-gray-700 hover:bg-gray-50"
              >
                <span className="font-medium text-sm">Painel Admin</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Perfil e Logout */}
      <div className="p-3 border-t">
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-900">
            {session?.user?.name || 'Usuário'}
          </p>
          <p className="text-xs text-gray-500">
            {session?.user?.email}
          </p>
        </div>
        <Link
          href="/api/auth/signout"
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Sair</span>
        </Link>
      </div>
    </div>
  )
}