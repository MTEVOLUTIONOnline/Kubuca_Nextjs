import type React from "react"
import { Sidebar } from "@/app/components/user/sidebar"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

