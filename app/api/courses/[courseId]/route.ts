import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth'
import { prisma } from '@/lib/prisma'

// @ts-ignore
export async function DELETE(
    request: Request,
    { params }: { params: { courseId: string } }
  ) {
    try {
      const session = await getServerSession(authOptions);
  
      if (!session?.user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
  
      const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
      });
  
      if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }
  
      // Forçar o tipo de `params.courseId` manualmente
      const courseId = params.courseId as string;
  
      const course = await prisma.course.findFirst({
        where: {
          id: courseId, // Usar a variável `courseId` com o tipo forçado
          instructorId: user.id,
        },
      });
  
      if (!course) {
        return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 });
      }
  
      // Primeiro, excluir todas as entidades relacionadas ao curso
      await prisma.$transaction(async (tx) => {
        // 1. Excluir progresso das aulas
        await tx.lessonProgress.deleteMany({
          where: {
            lesson: {
              module: {
                courseId: courseId, // Usar a variável `courseId` com o tipo forçado
              },
            },
          },
        });
  
        // 2. Excluir aulas
        const modules = await tx.module.findMany({
          where: { courseId: courseId }, // Usar a variável `courseId` com o tipo forçado
          select: { id: true },
        });
  
        const moduleIds = modules.map((m) => m.id);
  
        await tx.lesson.deleteMany({
          where: {
            moduleId: {
              in: moduleIds,
            },
          },
        });
  
        // 3. Excluir módulos
        await tx.module.deleteMany({
          where: { courseId: courseId }, // Usar a variável `courseId` com o tipo forçado
        });
  
        // 4. Excluir links de afiliados
        await tx.affiliate.deleteMany({
          where: { courseId: courseId }, // Usar a variável `courseId` com o tipo forçado
        });
  
        // 5. Marcar compras como deletadas
        await tx.purchase.updateMany({
          where: { courseId: courseId }, // Usar a variável `courseId` com o tipo forçado
          data: { status: 'deleted' },
        });
      });
  
      // Depois, excluir o curso
      await prisma.course.delete({
        where: { id: courseId }, // Usar a variável `courseId` com o tipo forçado
      });
  
      return NextResponse.json({ message: 'Curso deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      return NextResponse.json(
        { error: 'Erro ao excluir curso' },
        { status: 500 }
      );
    }
  }