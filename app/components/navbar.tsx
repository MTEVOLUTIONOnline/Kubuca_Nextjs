"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="https://qxi5ol0ajf.ufs.sh/f/gsRgPIz1OcKELeKx4y5qv5Yu4TW0nbXrGst2Rke7OioAcV6w"
              alt="Kiwify"
              width={190}
              height={60}
              className="h-8 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#pricing" className="text-gray-600 hover:text-gray-900">
              Taxas
            </Link>
            <Link href="/#faq" className="text-gray-600 hover:text-gray-900">
              FAQ
            </Link>
            <Link href="/help" className="text-gray-600 hover:text-gray-900">
              Ajuda
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              Sobre nós
            </Link>
            <Link href="/marketplace" className="text-gray-600 hover:text-gray-900">
              Marketplace
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost"><Link href="/login">Login</Link></Button>
            <Button variant="outline"><Link href="/register">Cadastrar agora</Link></Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

