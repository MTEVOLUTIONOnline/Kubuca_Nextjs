import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import EbookActions from './EbookActions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EbookPage({ 
  params 
}: { 
  params: { ebookId: string } 
}) {
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
      id: params.ebookId,
      affiliateCommission: {
        gt: 0 // Apenas eBooks com programa de afiliados
      }
    },
    include: {
      user: {
        select: {
          name: true
        }
      },
      affiliates: {
        where: {
          userId: user.id
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
              src={process.env.NEXT_PUBLIC_BACKEND_URL+"/"+ebook.thumbnailUrl}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Sobre o eBook</h2>
                  <p className="text-gray-600">{ebook.description}</p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">Preço do eBook</p>
                    <p className="text-3xl font-bold">
                      {ebook.price.toLocaleString('pt-PT', {
                        style: 'currency',
                        currency: 'MZN'
                      })}
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-500">Comissão por venda</p>
                    <p className="text-2xl font-bold text-green-600">
                      {((ebook.price * ebook.affiliateCommission) / 100).toLocaleString('pt-PT', {
                        style: 'currency',
                        currency: 'MZN'
                      })}
                      <span className="text-sm text-gray-500 ml-1">
                        ({ebook.affiliateCommission}%)
                      </span>
                    </p>
                  </div>

                  <EbookActions 
                    ebookId={ebook.id}
                    isAffiliated={ebook.affiliates.length > 0}
                    affiliateCode={ebook.affiliates[0]?.affiliateCode}
                    hasPurchased={!!existingPurchase}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 