import { Button } from "@/components/ui/button"
import Link from "next/link"
export default function SalesSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Mais vendas aprovadas</h2>

            <p className="text-gray-600">
              Através do KubucaPay, o processador de pagamentos próprio da Kubuca, não dependemos de intermediários que
              poderiam recusar suas vendas. Desta forma, oferecemos altas taxas de aprovação.
            </p>

            <p className="text-gray-600">
              O KubucaPay também possui uma funcionalidade de retentativas. Se o cartão do seu cliente for recusado por
              qualquer motivo no momento da compra, o KubucaPay faz uma nova tentativa automaticamente para você não
              perder essa venda.
            </p>

            <p className="text-gray-600 font-medium">
              Alguns de nossos clientes chegam a ter taxa de aprovação de cartão de mais de 90%:
            </p>

            <Link href="/register" >
              <Button size="lg" className="bg-[#00C49A] hover:bg-[#00B389] mt-4 text-white">
                Cadastrar agora
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="w-full h-[400px] rounded-full border-[16px] border-[#00C49A]/20">
              <div className="absolute top-1/4 -left-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div>
                  <p className="font-medium">Marcello Safe</p>
                  <p className="text-sm text-gray-500">@marcellosafe</p>
                </div>
                <div className="ml-4 px-3 py-1 bg-gray-900 text-white rounded">93%</div>
              </div>

              <div className="absolute bottom-1/4 -right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div>
                  <p className="font-medium">Alberto Soares</p>
                  <p className="text-sm text-gray-500">@albertosoares</p>
                </div>
                <div className="ml-4 px-3 py-1 bg-gray-900 text-white rounded">97%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

