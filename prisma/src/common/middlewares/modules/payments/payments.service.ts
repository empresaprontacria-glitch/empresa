import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient, SubscriptionStatus } from '@prisma/client';
import { AsaasWebhookDto, CreateSubscriptionPaymentDto } from './payments.dto';

const prisma = new PrismaClient();

@Injectable()
export class PaymentsService {

  // 1. GERAR COBRANÇA DE ASSINATURA (Exemplo de integração com API Asaas)
  async createSubscriptionCharge(dto: CreateSubscriptionPaymentDto) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: dto.tenantId },
    });

    const plan = await prisma.plan.findUnique({
      where: { id: dto.planId },
    });

    if (!tenant || !plan) {
      throw new NotFoundException('Salão ou Plano não encontrado.');
    }

    // Aqui seu backend faz a chamada para a API do Gateway de Pagamento (Asaas/Mercado Pago)
    // Passando o tenant.id dentro de `externalReference` para sabermos de quem é o pagamento quando o Webhook responder.
    
    return {
      message: 'Cobrança gerada com sucesso.',
      pixQrCode: '00020126580014BR.GOV.BCB.PIX...', // Exemplo de PIX Copia e Cola retornado
      value: plan.price,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Vencimento em 30 dias
    };
  }

  // 2. PROCESSAR O WEBHOOK RECEBIDO DO BANCO (AUTOMAÇÃO TOTAL)
  async handleAsaasWebhook(payload: AsaasWebhookDto) {
    const { event, payment } = payload;
    const tenantId = payment.externalReference;

    if (!tenantId) {
      throw new BadRequestException('Webhook recebido sem identificador de tenant (externalReference).');
    }

    // EVENTO: Pagamento Confirmado / Recebido
    if (event === 'PAYMENT_RECEIVED') {
      const newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + 30); // Adiciona +30 dias de acesso

      // Atualiza o status no banco para ACTIVE e estende a validade
      await prisma.subscription.update({
        where: { tenantId },
        data: {
          status: SubscriptionStatus.ACTIVE,
          dueDate: newDueDate,
        },
      });

      console.log(`[PAGAMENTO CONFIRMADO] Tenant ${tenantId} ativado até ${newDueDate.toISOString()}`);
      return { success: true, message: 'Assinatura reativada/renovada.' };
    }

    // EVENTO: Cobrança Vencida / Inadimplência
    if (event === 'PAYMENT_OVERDUE') {
      // Bloqueia o acesso imediatamente alterando para OVERDUE
      await prisma.subscription.update({
        where: { tenantId },
        data: {
          status: SubscriptionStatus.OVERDUE,
        },
      });

      console.log(`[INADIMPLÊNCIA] Tenant ${tenantId} foi suspenso por falta de pagamento.`);
      return { success: true, message: 'Assinatura suspensa.' };
    }

    return { success: true, message: 'Evento ignorado sem alterações.' };
  }
}