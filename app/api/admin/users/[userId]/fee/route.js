import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { userId } = params;
    const { withdrawalFee } = await request.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: { withdrawalFee },
      select: {
        id: true,
        name: true,
        email: true,
        withdrawalFee: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao atualizar taxa:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar taxa' },
      { status: 500 }
    );
  }
} 