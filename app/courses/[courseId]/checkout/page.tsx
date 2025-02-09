import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import AffiliateCheckout from '@/app/components/checkout/AffiliateCheckout'
import { authOptions } from '@/app/api/auth'

type Props = {
  params: {
    courseId: string
  }
  searchParams: {
    ref?: string // código do afiliado
  }
}

export default async function CheckoutPage({ params, searchParams }: Props) {
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

  // Buscar curso com dados do instrutor
  const course = await prisma.course.findUnique({
    where: { 
      id: params.courseId,
      affiliateCommission: {
        gt: 0 // Apenas cursos com programa de afiliados
      }
    },
    include: {
      instructor: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  if (!course) {
    redirect('/dashboard/marketplace')
  }

  // Não permitir que o instrutor compre seu próprio curso
  if (course.instructor.email === session.user.email) {
    redirect('/dashboard/courses')
  }

  // Verificar se já comprou
  const existingPurchase = await prisma.purchase.findFirst({
    where: {
      courseId: params.courseId,
      userId: user.id,
      status: 'completed'
    }
  })

  if (existingPurchase) {
    redirect(`/dashboard/my-courses/${params.courseId}`)
  }

  // Verificar código de afiliado
  let affiliateData = null
  if (searchParams.ref) {
    const affiliate = await prisma.affiliate.findFirst({
      where: {
        affiliateCode: searchParams.ref,
        courseId: params.courseId
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    if (affiliate) {
      affiliateData = {
        code: affiliate.affiliateCode,
        name: affiliate.user.name
      }
    }
  }

  return (
    <AffiliateCheckout 
      course={course}
      affiliateData={affiliateData}
    />
  )
} 