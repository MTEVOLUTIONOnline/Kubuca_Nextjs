import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import DashboardStats from '@/app/components/dashboard/DashboardStats'
import ProductList from '@/app/components/dashboard/ProductList'
import Link from 'next/link'

export default async function DashboardPage() {
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

  // Buscar cursos do instrutor com vendas
  const coursesWithSales = await prisma.course.findMany({
    where: {
      instructorId: user.id
    },
    include: {
      _count: {
        select: {
          purchases: {
            where: {
              status: 'completed'
            }
          }
        }
      },
      purchases: {
        where: {
          status: 'completed'
        },
        select: {
          amount: true
        }
      }
    }
  })

  // Calcular estatísticas
  const totalRevenue = coursesWithSales.reduce((sum, course) => 
    sum + course.purchases.reduce((courseSum, purchase) => courseSum + purchase.amount, 0)
  , 0)

  const totalSales = coursesWithSales.reduce((sum, course) => 
    sum + course._count.purchases
  , 0)

  const stats = {
    totalRevenue,
    totalSales,
    totalCourses: coursesWithSales.length,
    averageRevenuePerSale: totalSales > 0 ? totalRevenue / totalSales : 0
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <DashboardStats stats={stats} />
      
      <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Marketplace de Afiliados</h2>
            <p className="text-sm text-gray-500">Encontre cursos para promover e ganhar comissão</p>
          </div>
          <Link
            href="/dashboard/marketplace"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Ver Marketplace
          </Link>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Meus Produtos</h2>
        <ProductList courses={coursesWithSales} />
      </div>
    </div>
  )
} 

// my-courses