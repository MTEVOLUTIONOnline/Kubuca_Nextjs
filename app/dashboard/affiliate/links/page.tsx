import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AffiliateLinksTable from '@/app/components/affiliate/AffiliateLinksTable'

export default async function AffiliateLinksPage() {
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

  const affiliateLinks = await prisma.affiliate.findMany({
    where: {
      userId: user.id
    },
    include: {
      course: true,
      _count: {
        select: {
          purchases: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Meus Links de Afiliado</h1>
      
      {affiliateLinks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h2 className="text-xl text-gray-600">
            Você ainda não tem links de afiliado
          </h2>
          <p className="text-gray-500 mt-2">
            Visite o marketplace para encontrar cursos para promover
          </p>
        </div>
      ) : (
        <AffiliateLinksTable links={affiliateLinks} />
      )}
    </div>
  )
} 