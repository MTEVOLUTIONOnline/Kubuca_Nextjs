import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const { courseId } = params;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: user.id,
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.lessonProgress.deleteMany({
        where: {
          lesson: {
            module: {
              courseId: courseId,
            },
          },
        },
      });

      const modules = await tx.module.findMany({
        where: { courseId: courseId },
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

      await tx.module.deleteMany({
        where: { courseId: courseId },
      });

      await tx.affiliate.deleteMany({
        where: { courseId: courseId },
      });

      await tx.purchase.updateMany({
        where: { courseId: courseId },
        data: { status: 'deleted' },
      });
    });

    await prisma.course.delete({
      where: { id: courseId },
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