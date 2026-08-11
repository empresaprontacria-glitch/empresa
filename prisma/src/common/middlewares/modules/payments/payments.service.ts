import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private prisma = new PrismaClient();

  // Criar cobrança de assinatura (solicitado no controller)
  async createSubscriptionCharge(data: any) {
    // Implementação da criação de cobrança ou retorno do payload
    return { success: true, data };
  }

  // Webhook do Asaas (solicitado no controller)
  async handleAsaasWebhook(body: any) {
    if (body.event === 'PAYMENT_RECEIVED' || body.event === 'PAYMENT_CONFIRMED') {
      const tenantId = body.payment?.externalReference;
      if (tenantId) {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);

        await this.prisma.subscription.updateMany({
          where: { tenantId },
          data: {
            status: 'ACTIVE',
            currentPeriodEnd: nextYear,
          },
        });
      }
    }
    return { received: true };
  }

  // Método de auxílio direto
  async handlePaymentSuccess(tenantId: string, planId: string, durationMonths: number = 1) {
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + durationMonths);

    const subscription = await this.prisma.subscription.findFirst({
      where: { tenantId },
    });

    if (subscription) {
      return await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'ACTIVE',
          currentPeriodEnd,
          plan: { connect: { id: planId } },
        },
      });
    } else {
      return await this.prisma.subscription.create({
        data: {
          tenant: { connect: { id: tenantId } },
          plan: { connect: { id: planId } },
          status: 'ACTIVE',
          currentPeriodEnd,
        },
      });
    }
  }
}