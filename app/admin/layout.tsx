import type { Metadata } from "next"
import { Inter } from "next/font/google"
import AdminSidebar from "../components/admin/AdminSidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ADMIN - KUBUCA",
  icons: {
    icon: "https://qxi5ol0ajf.ufs.sh/f/gsRgPIz1OcKELeKx4y5qv5Yu4TW0nbXrGst2Rke7OioAcV6w",
  },
  description: "Painel de controle do sistema Kubuca",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className=" flex-1">
        {children}
      </main>
    </div>
  )
}
