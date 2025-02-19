import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Constantes para status de pagamento
const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
};

export async function POST(request) {
  try {
    // Verifica a sessão do usuário
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para continuar.' },
        { status: 401 }
      );
    }

    // Extrai o ID do usuário da sessão
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário não encontrado na sessão.' },
        { status: 401 }
      );
    }

    // Extrai e valida os dados da requisição
    const { amount, mpesaName, mpesaNumber } = await request.json();

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'O valor do saque deve ser um número positivo.' },
        { status: 400 }
      );
    }

    if (!mpesaName || typeof mpesaName !== 'string' || mpesaName.trim() === '') {
      return NextResponse.json(
        { error: 'O nome no M-Pesa é obrigatório.' },
        { status: 400 }
      );
    }

    if (!mpesaNumber || typeof mpesaNumber !== 'string' || !/^\+258\s?\d{9}$/.test(mpesaNumber)) {
      return NextResponse.json(
        { error: 'O número do M-Pesa deve estar no formato +258 84 XXX XXXX.' },
        { status: 400 }
      );
    }

    // Buscar taxa atual
    const settings = await prisma.settings.findFirst();
    const withdrawalFee = settings?.withdrawalFee || 10;
    
    // Calcular valor da taxa
    const feeAmount = (amount * withdrawalFee) / 100;
    const finalAmount = amount - feeAmount;

    // Verifica se o usuário tem saldo suficiente
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado.' },
        { status: 404 }
      );
    }

    if (user.balance < amount) {
      return NextResponse.json(
        { error: 'Saldo insuficiente para realizar o saque.' },
        { status: 400 }
      );
    }

    // Cria a solicitação de saque
    const payment = await prisma.payment.create({
      data: {
        userId: userId,
        amount: amount,
        finalAmount: finalAmount,
        feeAmount: feeAmount,
        feePercentage: withdrawalFee,
        mpesaName: mpesaName.trim(),
        mpesaNumber: mpesaNumber.trim(),
        status: PAYMENT_STATUS.PENDING,
      },
    });

    // Atualiza o saldo do usuário
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } },
    });

    // Registra a atividade
    await prisma.activity.create({
      data: {
        userId: userId,
        description: `Solicitação de saque de ${amount.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'MZN'
        })} (Taxa: ${feeAmount.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'MZN'
        })})`,
      },
    });

    // Retorna a resposta de sucesso
    return NextResponse.json(
      { success: true, payment },
      { status: 201 }
    );

  } catch (error) {
    console.error({
      message: 'Erro ao criar solicitação de saque',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });

    return NextResponse.json(
      { 
        error: 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}