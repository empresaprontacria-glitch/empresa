import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AsaasWebhookDto, CreateSubscriptionPaymentDto } from './payments.dto';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Rota para o salão solicitar o PIX/Boleto de renovação
  @Post('checkout')
  async checkout(@Body() dto: CreateSubscriptionPaymentDto) {
    return await this.paymentsService.createSubscriptionCharge(dto);
  }

  // ENDPOINT DO WEBHOOK (O Asaas envia os avisos diretamente para esta URL)
  @Post('webhook/asaas')
  @HttpCode(HttpStatus.OK)
  async asaasWebhook(@Body() payload: AsaasWebhookDto) {
    return await this.paymentsService.handleAsaasWebhook(payload);
  }
}