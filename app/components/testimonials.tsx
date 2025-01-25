import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Link from "next/link"

const testimonials = [
  {
    quote: "O Kubuca aumentou minha autoridade",
    author: "@suelenmelloo",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    quote: "O Kubuca me deu muita audiência qualificada",
    author: "@natansousaads",
    image: "/placeholder.svg?height=400&width=300",
  },
]

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl mb-12">Confira alguns depoimentos de quem participou:</h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-[4/3] bg-[#2D3748] rounded-lg p-8 flex flex-col justify-between">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white z-10">"{testimonial.quote}"</h3>
                <p className="text-white/80 z-10">{testimonial.author}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-40 h-48">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={`Foto de ${testimonial.author}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
        <Link href="/register" >
              <Button size="lg" className="bg-[#00C49A] hover:bg-[#00B389] mt-4 text-white">
                Cadastrar agora
              </Button>
            </Link>
        </div>
      </div>
    </section>
  )
}

