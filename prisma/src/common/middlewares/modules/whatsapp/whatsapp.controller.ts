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

  @Get('qrcode/:tenantId')
  async getQrCode(@Param('tenantId') tenantId: string) {
    return await this.whatsappService.getQrCode(tenantId);
  }

  @Post('send-text')
  async sendMessage(@Body() dto: SendTextMessageDto) {
    return await this.whatsappService.sendMessage(dto.tenantId, dto.number, dto.text);
  }
  @Get('tenants')
async getTenants() {
  return await this.whatsappService.getAllTenants(); // ou consulta direta no Prisma
}
}