import { authOptions } from '@/app/api/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import CourseList from '@/app/components/CourseList'
import { prisma } from '@/lib/prisma'
import { Plus, Book, BookOpen } from 'lucide-react'
import Image from 'next/image'

export default async function ProductsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <div>Acesso negado</div>
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!
    }
  })

  if (!user) {
    return <div>Usuário não encontrado</div>
  }

  // Buscar cursos do usuário
  const courses = await prisma.course.findMany({
    where: {
      instructorId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Buscar PLRs do usuário
  const plrs = await prisma.pLR.findMany({
    where: {
      userId: user.id // Usando userId para buscar PLRs do usuário
    },
    include: {
      user: true // Incluindo informações do usuário, se necessário
    },
    orderBy: {
      createdAt: 'desc' // Ordenando por data de criação
    }
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Produtos</h1>
        <div className="space-x-4">
          <Link
            href="/dashboard/products/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 border-indigo-600 hover:border-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Produto
          </Link>
        </div>
      </div>

      {/* Lista de Cursos */}
      <div className="mb-16">
        <div className='flex items-center justify-between mb-12'>
          <div className="flex items-center mb-6">
            <BookOpen className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Cursos</h2>
          </div>
          <div>
            <Link href="products/courses">
              Ver todos
            </Link>
          </div>
        </div>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map(course => (
              <div key={course.id} className="relative">
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1 z-50 rounded-md flex items-center gap-1">
                  <Book className="w-4 h-4 text-white" /> Curso
                </div>
                <div className="bg-white rounded-lg">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${course.imageUrl}`}
                    alt={course.title}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <h3 className="text-lg font-semibold mb-2 mt-6">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      {course.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'MZN'
                      })}
                    </span>
                    <Link
                      href={`/dashboard/products/courses/${course.id}/modules`}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Gerenciar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Você ainda não tem nenhum curso.</p>
        )}
      </div>

      {/* Lista de PLRs */}
      <div>
        <div className='flex items-center justify-between mb-12'>
          <div className="flex items-center mb-6">
            <Book className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold">Ebooks </h2>
          </div>
          <div>
            <Link href="products/ebook">
              Ver todos
            </Link>
          </div>
        </div>
        {plrs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plrs.map(plr => (
              <div key={plr.id} className="bg-white">
                <div className="relative h-48">
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1 z-50 rounded-md flex items-center gap-1">
                    <Book className="w-4 h-4 text-white" /> eBook
                  </div>
                  {plr.thumbnailUrl ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${plr.thumbnailUrl}`}
                      alt={plr.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Book className="w-16 h-16 text-white opacity-75" />
                    </div>
                  )}
                </div>
                <div className="">
                  <h3 className="text-lg font-semibold mb-2 mt-6">{plr.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{plr.description}</p>
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-xs text-gray-500 mt-1">
                      {JSON.parse(plr.ebookUrls).length} ebooks incluídos
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      {plr.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'MZN'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Você ainda não tem nenhum ebook PLR.</p>
        )}
      </div>

      {courses.length === 0 && plrs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Você ainda não tem nenhum produto. Comece criando um curso ou ebook PLR!
          </p>
        </div>
      )}
    </div>
  )
}

