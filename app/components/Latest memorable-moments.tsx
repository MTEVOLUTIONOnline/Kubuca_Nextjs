import Image from "next/image"

export default function MemorableMoments() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    Acreditamos que aqueles que elevam o padrão de excelência do mercado{" "}
                    <span className="text-emerald-500">também merecem momentos memoráveis</span>
                </h2>

                <p className="text-lg md:text-xl text-gray-600">
                    Por isso, em todo final de ano, nossos colaboradores{" "}
                    <span className="text-emerald-500 font-medium">Kubuca</span> desfrutam juntos de momentos inesquecíveis em
                    suas carreiras.
                </p>
            </div>

            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mt-8">
                <Image
                    src="https://kiwify.com.br/sobre-nos/wp-content/uploads/2024/08/confra-2.webp"
                    alt="Kiwifyers celebrando juntos"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    )
}

