import { TrainAiDto, ProcessMessageDto } from './ai.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class AiService {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    trainKnowledgeBase(dto: TrainAiDto): Promise<{
        success: boolean;
        message: string;
    }>;
    private searchKnowledgeBase;
    processIncomingMessage(dto: ProcessMessageDto): Promise<{
        status: string;
        success?: undefined;
        reply?: undefined;
    } | {
        success: boolean;
        reply: string;
        status?: undefined;
    }>;
}
