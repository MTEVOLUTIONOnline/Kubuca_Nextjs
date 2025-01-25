import { ThumbsUp, Send, Heart } from "lucide-react"

export default function AboutHistory() {
  return (
    <div className="min-h-screen bg-white mt-20">
      {/* Timeline */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-center items-center gap-4 mb-12">
          {[2020, 2021, 2022, 2023, 2024].map((year, index) => (
            <div key={year} className="flex items-center">
              <div className={`h-4 w-4 rounded-full ${index === 0 ? "bg-emerald-500" : "bg-gray-200"}`} />
              {index < 4 && <div className="w-16 h-[2px] bg-gray-200" />}
              <span className={`absolute mt-8 ${index === 0 ? "text-emerald-500" : "text-gray-300"}`}>{year}</span>
            </div>
          ))}
        </div>

        {/* History Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-24">
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://kiwify.com.br/sobre-nos/wp-content/uploads/2024/08/img.webp"
                alt="Kiwify presentation"
                className="rounded-lg shadow-lg mb-4 w-full"
              />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-emerald-500">Nossa história</h2>
            <p className="text-gray-600 text-lg">
              A Kubuca surgiu em 2020, criada por Artur Ribas e Marinho Gomes, como uma plataforma inovadora que
              transforma a maneira como os criadores de conteúdo criam e compartilham conhecimento online.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center mb-12">Nossa comunidade não tem fronteiras</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ThumbsUp, number: "+190", label: "colaboradores" },
              { icon: Send, number: "+29mil", label: "criadores de conteúdo" },
              { icon: Heart, number: "+25milhões", label: "de alunos" },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border flex items-center gap-4">
                <div className="bg-emerald-500 p-3 rounded-lg">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.number}</div>
                  <div className="text-emerald-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

