import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private prisma = new PrismaClient();

  async handlePaymentSuccess(tenantId: string, planId: string, durationMonths: number = 1) {
    // 1. Calcula a nova data final do período de assinatura (ex: 30 dias a partir de hoje)
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + durationMonths);

    // 2. Busca assinatura existente
    const subscription = await this.prisma.subscription.findFirst({
      where: { tenantId },
    });

    if (subscription) {
      // Atualiza assinatura existente
      return await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'ACTIVE',
          currentPeriodEnd: currentPeriodEnd, // <- Campo obrigatório ajustado
          plan: { connect: { id: planId } },
        },
      });
    } else {
      // Cria nova assinatura se não existir
      return await this.prisma.subscription.create({
        data: {
          tenant: { connect: { id: tenantId } },
          plan: { connect: { id: planId } },
          status: 'ACTIVE',
          currentPeriodEnd: currentPeriodEnd, // <- Campo obrigatório ajustado
        },
      });
    }
  }
}