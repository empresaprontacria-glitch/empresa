import { AiService } from './ai.service';
import { ProcessMessageDto, TrainAiDto } from './ai.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
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
