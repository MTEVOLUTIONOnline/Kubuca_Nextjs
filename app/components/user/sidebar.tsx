"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, Bell, Lock, Moon, Globe, Shield } from "lucide-react"

const sidebarItems = [
  { name: "Perfil", href: "/dashboard/settings", icon: User },
  { name: "Conta", href: "/dashboard/settings/account", icon: Lock },
  { name: "Notificações", href: "/dashboard/settings/notifications", icon: Bell },
  { name: "Aparência", href: "/dashboard/settings/appearance", icon: Moon },
  { name: "Idioma", href: "/dashboard/settings/language", icon: Globe },
  { name: "Privacidade", href: "/dashboard/settings/privacy", icon: Shield },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-1 w-full md:w-64">
      {sidebarItems.map((item) => (
        <Button
          key={item.name}
          variant="ghost"
          className={cn("justify-start", pathname === item.href && "bg-muted")}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Link>
        </Button>
      ))}
    </nav>
  )
}

