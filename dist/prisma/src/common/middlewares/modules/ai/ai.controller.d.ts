import { AiService } from './ai.service';
import { ProcessMessageDto, TrainAiDto } from './ai.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    trainKnowledgeBase(dto: TrainAiDto): Promise<{
        success: boolean;
        message: string;
    }>;
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
