import { PaymentsService } from './payments.service';
import { AsaasWebhookDto, CreateSubscriptionPaymentDto } from './payments.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    checkout(dto: CreateSubscriptionPaymentDto): Promise<{
        success: boolean;
        data: any;
    }>;
    asaasWebhook(payload: AsaasWebhookDto): Promise<{
        received: boolean;
    }>;
}
