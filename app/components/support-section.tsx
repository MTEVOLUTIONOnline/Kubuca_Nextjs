import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
export default function SupportSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="bg-[#2D3748] rounded-3xl p-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative">
              <div className="bg-[#00C49A] w-24 h-24 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -right-1 -top-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                1
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Atendimento em 1 minuto, 7 dias por semana</h2>

              <p className="text-white/80 text-lg leading-relaxed">
                Na Kubuca você tem suporte especializado 7 dias por semana, das 08h00 até às 21h00, através de chat ao
                vivo. Com uma equipe que te responde em apenas um minuto. Sem robôs ou automações, você tem sempre uma
                pessoa especializada pronta para te ajudar.
              </p>

              <Link href="/register" >
                <Button size="lg" className="bg-[#00C49A] hover:bg-[#00B389] mt-4 text-white">
                  Cadastrar agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

