import { authOptions } from '@/app/api/auth'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import EbookActions from './[ebookId]/EbookActions' // Importando o componente de ações do eBook
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: {
    ebookId: string
  }
}

export default async function EbookPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!
    }
  })

  if (!user) {
    redirect('/login')
  }

  const ebook = await prisma.pLR.findUnique({
    where: {
      id: params.ebookId
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  })

  if (!ebook) {
    redirect('/dashboard/marketplace')
  }

  const existingPurchase = await prisma.pLRPurchase.findFirst({
    where: {
      userId: user.id,
      plrId: params.ebookId,
      status: 'completed'
    }
  })

  // Verificação se o usuário tem um link de afiliado para este eBook
  const existingAffiliate = await prisma.pLRAffiliate.findFirst({
    where: {
      userId: user.id,
      plrId: params.ebookId
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botão Voltar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link 
          href="/dashboard/marketplace" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para o Marketplace
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cabeçalho do eBook */}
          <div className="relative h-96">
            <Image
              src={process.env.NEXT_PUBLIC_BACKEND_URL + "/" + ebook.thumbnailUrl}
              alt={ebook.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
              <div className="px-8 text-white">
                <h1 className="text-4xl font-bold mb-4">{ebook.title}</h1>
                <p className="text-xl mb-2">Por {ebook.user.name}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Sobre o eBook</h2>
            <p className="text-gray-600">{ebook.description}</p>

            <EbookActions 
              ebookId={ebook.id}
              hasPurchased={!!existingPurchase}
              isAffiliated={!!existingAffiliate} // Passando a variável de afiliado para o componente
            />
          </div>
        </div>
      </div>
    </div>
  )
}
