'use client'
import Link from 'next/link'

type CourseMenuProps = {
  courseId: string
  currentPage?: 'details' | 'modules' | 'purchases'
}

export default function CourseMenu({ courseId, currentPage = 'details' }: CourseMenuProps) {
  const menuItems = [
    { id: 'details', label: 'Detalhes', href: `/dashboard/courses/${courseId}` },
    { id: 'modules', label: 'Módulos', href: `/dashboard/courses/${courseId}/modules` },
    { id: 'purchases', label: 'Vendas', href: `/dashboard/courses/${courseId}/purchases` },
  ]

  return (
    <nav className="flex space-x-4 mb-6">
      {menuItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`px-4 py-2 rounded-lg ${
            currentPage === item.id
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
} 