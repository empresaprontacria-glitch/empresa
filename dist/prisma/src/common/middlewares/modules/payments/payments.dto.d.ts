export declare class CreateSubscriptionPaymentDto {
    tenantId: string;
    planId: string;
    billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
    customerDocument: string;
}
export declare class AsaasWebhookDto {
    event: 'PAYMENT_RECEIVED' | 'PAYMENT_OVERDUE' | 'PAYMENT_DELETED';
    payment: {
        id: string;
        customer: string;
        value: number;
        externalReference: string;
    };
}
