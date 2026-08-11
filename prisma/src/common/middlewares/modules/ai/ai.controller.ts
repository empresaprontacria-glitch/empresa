import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { ProcessMessageDto, TrainAiDto } from './ai.dto';

@Controller('api/v1/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  // Rota para o salão cadastrar novos textos no treinamento RAG
  @Post('train')
  async trainKnowledgeBase(@Body() dto: TrainAiDto) {
    return await this.aiService.trainKnowledgeBase(dto);
  }

  // Rota interna acionada quando uma mensagem de WhatsApp chega via Webhook
  @Post('process-message')
  async processIncomingMessage(@Body() dto: ProcessMessageDto) {
    return await this.aiService.processIncomingMessage(dto);
  }
}   