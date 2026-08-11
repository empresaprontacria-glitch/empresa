import { WhatsappService } from './whatsapp.service';
import { CreateInstanceDto, SendTextMessageDto } from './whatsapp.dto';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    createInstance(dto: CreateInstanceDto): Promise<any>;
    getQrCode(tenantId: string): Promise<any>;
    sendMessage(dto: SendTextMessageDto): Promise<any>;
    getTenants(): Promise<any>;
}
