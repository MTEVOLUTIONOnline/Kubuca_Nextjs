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
      mpesaNumber, 
      feeAmount, 
      finalAmount, 
      feePercentage 
    } = await request.json();

    // Buscar usuário com saldo e pagamentos pendentes
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        balance: true,
        payments: {
          where: {
            status: 'PENDING'
          },
          select: {
            amount: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Calcular saldo disponível (descontando pagamentos pendentes)
    const pendingAmount = user.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const availableBalance = user.balance - pendingAmount;

    // Verificar se tem saldo suficiente
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

    // Não vamos mais decrementar o saldo aqui
    // O saldo só será decrementado quando o admin aprovar o saque

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Erro ao criar solicitação de saque:', error);
    return NextResponse.json(
      { error: 'Erro ao criar solicitação de saque' },
      { status: 500 }
    );
  }
}