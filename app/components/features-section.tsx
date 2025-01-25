import { CreditCard, Clock, Lock, HandshakeIcon, Store, LayoutTemplate, Smartphone, MoreHorizontal } from "lucide-react"

const features = [
  {
    icon: CreditCard,
    title: "Receba cartão e Pix",
    description: "em até 2 dias",
  },
  {
    icon: Clock,
    title: "Liberação do produto",
    description: "imediata",
  },
  {
    icon: Lock,
    title: "Checkout builder",
    description: "",
  },
  {
    icon: HandshakeIcon,
    title: "Co-produção",
    description: "",
  },
  {
    icon: Store,
    title: "Marketplace de",
    description: "Afiliados",
  },
  {
    icon: LayoutTemplate,
    title: "Área de membros",
    description: "personalizável",
  },
  {
    icon: Smartphone,
    title: "Mobile app para os",
    description: "seus alunos assistirem às aulas",
  },
  {
    icon: MoreHorizontal,
    title: "E muito mais...",
    description: "",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">A Kubuca tem a melhor tecnologia</h2>
          <p className="text-gray-600 text-lg">
            Nossa plataforma é simples e fácil de usar. Crie uma conta e comece a vender em 2 minutos.
          </p>
        </div>

        <p className="text-center text-gray-600 mb-12">
          Temos todas as funcionalidades que você precisa para vender o seu infoproduto:
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-[#00C49A]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#00C49A]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">{feature.title}</h3>
                  {feature.description && <p className="text-gray-600 text-sm">{feature.description}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

