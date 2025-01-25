import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingSection() {
  return (
    <section className="py-24 bg-gray-50" id="pricing">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Quanto custa?</h2>
          <p className="text-gray-600 mb-8">Você só paga se vender</p>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold">8.99%</span>
              <span className="text-gray-600">+ R$2,49</span>
            </div>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#00C49A]" />
                <span className="text-gray-600">Receba em cartão em 15 dias, boletos e Pix em 2 dias</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#00C49A]" />
                <span className="text-gray-600">Possibilidade de receber cartões em 2 dias</span>
              </li>
            </ul>

            <Link href="/register" >
              <Button size="lg" className="bg-[#00C49A] hover:bg-[#00B389] mt-4 text-white">
                Cadastrar agora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

