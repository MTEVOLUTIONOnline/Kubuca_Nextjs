import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Youtube } from "lucide-react"

const footerLinks = {
  platform: {
    title: "Plataforma",
    links: [
      { label: "Taxas", href: "/#pricing" },
      { label: "FAQ", href: "/faq" },
      { label: "Ajuda", href: "/help" },
      { label: "Marketplace", href: "/marketplace" },
    ],
  },
  company: {
    title: "A Empresa",
    links: [
      { label: "Contato", href: "/help" },
      { label: "Sobre nós", href: "/about" },
      { label: "Denúncias", href: "/help" },
      { label: "Transparência Salarial", href: "/help" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Termos de uso", href: "#" },
      { label: "Termos de uso Kubuca", href: "#" },
      { label: "Termos de licença de software", href: "#" },
      { label: "Política de conteúdo", href: "#" },
      { label: "Política de Privacidade", href: "#" },
    ],
  },
}

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600">© 2024 Todos os direitos reservados</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Kubuca Pagamentos, Tecnologia e Serviços MTEVOLUTION</p>
              <p>Endereço: Av. Ahmed Sekou Touré, Maputo - Moçambique </p>
              <p>Numero: +258 850206887.</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Contato:</p>
              <div className="text-sm text-gray-600">
                <p>
                  Se você comprou um produto:{" "}
                  <Link href="mailto:kubuca@gmail.com" className="text-primary hover:underline">
                    kubuca@gmail.com
                  </Link>
                </p>
                <p>
                  Se você é infoprodutor:{" "}
                  <Link href="mailto:kubuca@gmail.com" className="text-primary hover:underline">
                    kubuca@gmail.com
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              <Facebook className="w-6 h-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              <Instagram className="w-6 h-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              <Youtube className="w-6 h-6" />
              <span className="sr-only">YouTube</span>
            </Link>
          </div>

          <Link href="/" className="flex items-center">
            <Image
              src="https://qxi5ol0ajf.ufs.sh/f/gsRgPIz1OcKELeKx4y5qv5Yu4TW0nbXrGst2Rke7OioAcV6w"
              alt="Kiwify"
              width={190}
              height={60}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}

