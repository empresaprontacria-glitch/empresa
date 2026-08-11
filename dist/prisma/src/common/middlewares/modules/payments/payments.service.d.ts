export declare class PaymentsService {
    private prisma;
    createSubscriptionCharge(data: any): Promise<{
        success: boolean;
        data: any;
    }>;
    handleAsaasWebhook(body: any): Promise<{
        received: boolean;
    }>;
    handlePaymentSuccess(tenantId: string, planId: string, durationMonths?: number): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        status: string;
        planId: string;
        paymentMethod: string;
        currentPeriodEnd: Date;
    }>;
}
