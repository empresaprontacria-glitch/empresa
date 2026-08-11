import { ProcessMessageDto, TrainAiDto } from './ai.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class AiService {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    trainKnowledgeBase(dto: TrainAiDto): Promise<{
        id: string;
        tenantId: string;
        systemPrompt: string;
        businessContext: string;
        isAiActive: boolean;
    }>;
    processIncomingMessage(dto: ProcessMessageDto): Promise<{
        message: string;
        response?: undefined;
    } | {
        response: import("@langchain/core/messages").MessageContent;
        message?: undefined;
    }>;
}
