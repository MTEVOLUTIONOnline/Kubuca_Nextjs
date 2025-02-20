import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { 
      amount, 
      mpesaName, 
      mpesaNumber
    } = await request.json();

    // Buscar usuário com sua taxa personalizada e configurações gerais
    const [user, settings] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { 
          balance: true,
          withdrawalFee: true,
          payments: {
            where: {
              status: 'PENDING'
            },
            select: {
              amount: true
            }
          }
        }
      }),
      prisma.settings.findFirst()
    ]);

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Usar taxa personalizada ou padrão
    const feePercentage = user.withdrawalFee ?? settings.withdrawalFee;
    const feeAmount = (amount * feePercentage) / 100;
    const finalAmount = amount - feeAmount;

    // Calcular saldo disponível
    const pendingAmount = user.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const availableBalance = user.balance - pendingAmount;

    if (availableBalance < amount) {
      return NextResponse.json(
        { error: 'Saldo insuficiente. Considere os saques pendentes.' },
        { status: 400 }
      );
    }

    // Criar o pagamento
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount,
        mpesaName,
        mpesaNumber,
        status: 'PENDING',
        finalAmount,
        feeAmount,
        feePercentage
      }
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Erro ao criar solicitação de saque:', error);
    return NextResponse.json(
      { error: 'Erro ao criar solicitação de saque' },
      { status: 500 }
    );
  }
}