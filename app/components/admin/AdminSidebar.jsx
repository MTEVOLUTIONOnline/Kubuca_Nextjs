"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CreditCard, GraduationCap, LinkIcon, WalletCards, BarChart3 } from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Usuarios", icon: Users },
    { href: "/admin/payments", label: "Pagamentos", icon: CreditCard },
    { href: "/admin/transactions", label: "Transações", icon: WalletCards },
    { href: "/admin/portfolio", label: "Portfólio", icon: BarChart3 },
  ]

  return (
    <div className="flex flex-col h-screen justify-between  p-4 ">
      <nav className="w-64 bg-blue-50/50 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
              "hover:bg-blue-100/80 hover:text-blue-700",
              isActive ? "bg-blue-100 text-blue-700" : "text-gray-700",
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
    <div className="">
      <Link href="/admin/settings" className="w-full  text-black p-2 rounded-lg">configurações</Link>
    </div>
    </div>
  )
}

