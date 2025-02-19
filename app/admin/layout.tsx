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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-6">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
