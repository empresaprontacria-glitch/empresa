import { AsaasWebhookDto, CreateSubscriptionPaymentDto } from './payments.dto';
export declare class PaymentsService {
    createSubscriptionCharge(dto: CreateSubscriptionPaymentDto): Promise<{
        message: string;
        pixQrCode: string;
        value: number;
        dueDate: Date;
    }>;
    handleAsaasWebhook(payload: AsaasWebhookDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
