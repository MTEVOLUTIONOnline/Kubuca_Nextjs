import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./providers/AuthProvider"
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kubuca - Venda seu curso online",
  icons:{
    icon: "https://qxi5ol0ajf.ufs.sh/f/gsRgPIz1OcKELeKx4y5qv5Yu4TW0nbXrGst2Rke7OioAcV6w",
  },
  description: "Transforme o seu conhecimento em um curso online e crie seu negócio na internet",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
