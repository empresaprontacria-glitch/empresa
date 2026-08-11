import { PaymentsService } from './payments.service';
import { AsaasWebhookDto, CreateSubscriptionPaymentDto } from './payments.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    checkout(dto: CreateSubscriptionPaymentDto): Promise<{
        message: string;
        pixQrCode: string;
        value: number;
        dueDate: Date;
    }>;
    asaasWebhook(payload: AsaasWebhookDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
