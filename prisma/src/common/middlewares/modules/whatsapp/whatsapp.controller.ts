import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { CreateInstanceDto, SendTextMessageDto } from './whatsapp.dto';

@Controller('api/v1/whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('instance')
  async createInstance(@Body() dto: CreateInstanceDto) {
    return await this.whatsappService.createInstance(dto.tenantId);
  }

  // Rota direta via GET para criar a instância pelo navegador
  @Get('create-instance/:tenantId')
  async createInstanceGet(@Param('tenantId') tenantId: string) {
    return await this.whatsappService.createInstance(tenantId);
  }

  @Get('qrcode/:tenantId')
  async getQrCode(@Param('tenantId') tenantId: string) {
    return await this.whatsappService.getQrCode(tenantId);
  }

  @Post('send-text')
  async sendMessage(@Body() dto: SendTextMessageDto) {
    return await this.whatsappService.sendMessage(dto.tenantId, dto.number, dto.text);
  }
}