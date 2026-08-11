export class CreateSubscriptionPaymentDto {
  tenantId: string;
  planId: string;
  billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
  customerDocument: string; // CPF ou CNPJ do dono do salão
}

// Estrutura simplificada de um evento de Webhook vindo do Asaas
export class AsaasWebhookDto {
  event: 'PAYMENT_RECEIVED' | 'PAYMENT_OVERDUE' | 'PAYMENT_DELETED';
  payment: {
    id: string;
    customer: string;
    value: number;
    externalReference: string; // Armazena o nosso tenantId
  };
}