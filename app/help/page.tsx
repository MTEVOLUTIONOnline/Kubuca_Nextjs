import  Navbar  from "@/app/components/navbar"
import Footer from "@/app/components/footer"
export default function HelpPage() {
  return <div>
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ajuda</h1>
      <div className="space-y-12">
      {/* Seção de Boas-vindas */}
      <section className="bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Bem-vindo ao Suporte Kubuca
        </h2>
        <p className="text-gray-600 mb-4">
          A Kubuca é a sua plataforma de ensino online que conecta instrutores talentosos a alunos 
          ávidos por conhecimento. Nossa missão é democratizar o ensino e proporcionar uma 
          experiência de aprendizado excepcional.
        </p>
        <p className="text-gray-600">
          Estamos aqui para ajudar você em sua jornada de aprendizado ou ensino. 
          Nossa equipe de suporte está disponível para responder suas dúvidas e auxiliar 
          no que for preciso.
        </p>
      </section>

      {/* Seção de Contatos */}
      <section className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Canais de Atendimento
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Email</h3>
              <p className="text-gray-600">kubuca@gmail.com</p>
              <p className="text-sm text-gray-500 mt-1">
                Resposta em até 24 horas úteis
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-green-50 p-2 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">WhatsApp</h3>
              <p className="text-gray-600">+258 85 020 6887</p>
              <p className="text-sm text-gray-500 mt-1">
                Atendimento de Segunda a Sexta, 8h às 17h
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Horários e Informações */}
      <section className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Informações Adicionais
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Horário de Atendimento</h3>
            <p className="text-gray-600">
              Segunda a Sexta: 8h às 17h<br />
              Sábados: 9h às 12h<br />
              Domingos e Feriados: Fechado
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Endereço</h3>
            <p className="text-gray-600">
              Maputo, Moçambique<br />
              © 2024 Kubuca. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </section>

      {/* Seção de Marketing */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Por que escolher a Kubuca?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Para Alunos</h3>
            <ul className="space-y-2">
              <li>✓ Cursos de alta qualidade</li>
              <li>✓ Preços acessíveis</li>
              <li>✓ Certificados reconhecidos</li>
              <li>✓ Aprenda no seu ritmo</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Para Instrutores</h3>
            <ul className="space-y-2">
              <li>✓ Alcance milhares de alunos</li>
              <li>✓ Ganhos ilimitados</li>
              <li>✓ Suporte completo</li>
              <li>✓ Programa de afiliados</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
    </div>
    <Footer />
  </div>
}

