import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export default function PremiumSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Confira os benefícios exclusivos da Kubuca para ajudar a aumentar suas vendas e escalar seu negócio.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <Image
              src="https://kiwify.com.br/wp-content/uploads/2023/08/mockup_kiwify-1.png"
              alt="Área de membros premium interface"
              width={800}
              height={600}
              className="rounded-lg"
            />
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-4xl font-bold">Área de Membros Premium: seu curso com design cinematográfico</h2>

            <p className="text-gray-600">
              A Kubuca oferece uma área de membros premium personalizável, que conta com um layout cinematográfico,
              similar a sua plataforma de streaming favorita.
            </p>

            <p className="text-gray-600">
              Trazendo um diferencial para a identidade visual do seu curso e proporcionando uma experiência única para
              seu aluno.
            </p>

            <p className="text-gray-600">
              Hospede e gerencie o seu curso online na nossa plataforma,{" "}
              <span className="font-semibold">sem custos extras</span>.
            </p>


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

