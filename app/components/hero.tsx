import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export default function Hero() {
  return (
    <div className="relative bg-[#f0faf6] min-h-screen">
      <div className="container mx-auto px-4 pt-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold leading-tight">Venda seu curso <br /> online</h1>
            <p className="text-xl text-gray-600">
              Transforme o seu conhecimento em um curso <br /> online e crie seu negócio na internet
            </p><br />
            <Link href="/register" className="mt-6">
              <Button size="lg" className="bg-[#00C49A]  hover:bg-[#00B389] text-white">
                Cadastrar agora
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://kiwify.com.br/wp-content/uploads/2023/08/Kiwify_imagem1-2.png"
              alt="Platform features"
              width={600}
              height={400}
              className="col-span-2 rounded-lg shadow-lg"
            />
          
          
          </div>
        </div>
      </div>
    </div>
  )
}

