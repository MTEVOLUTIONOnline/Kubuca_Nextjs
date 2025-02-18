import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth';

import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const purchase = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        courseId: params.courseId,
        status: 'completed'
      }
    });

    return NextResponse.json({ hasPurchased: !!purchase });
  } catch (error) {
    console.error('Erro ao verificar compra:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar compra' },
      { status: 500 }
    );
  }
}
