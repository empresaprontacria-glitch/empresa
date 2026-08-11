import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  // Endereço e Chave da Evolution API rodando no Docker
  private readonly evolutionUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
  private readonly apiKey = process.env.EVOLUTION_API_KEY || 'sua_chave_secreta_aqui_123';

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
    };
  }

  // 1. Criar Instância de WhatsApp única para o Salão
  async createInstance(tenantId: string) {
    try {
      const response = await axios.post(
        `${this.evolutionUrl}/instance/create`,
        {
          instanceName: `tenant_${tenantId}`,
          token: tenantId,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS',
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error: any) {
      throw new BadRequestException('Erro ao criar instância de WhatsApp: ' + error?.message);
    }
  }

  // 2. Obter QR Code em base64 para exibir no Painel do Salão
  async getQrCode(tenantId: string) {
    try {
      const response = await axios.get(
        `${this.evolutionUrl}/instance/connect/tenant_${tenantId}`,
        { headers: this.headers }
      );
      return response.data; // Retorna o base64 do QR Code para escaneamento
    } catch (error: any) {
      throw new BadRequestException('Erro ao buscar QR Code. Verifique se a instância foi criada.');
    }
  }

  // 3. Enviar mensagem de texto via WhatsApp
  async sendMessage(tenantId: string, number: string, text: string) {
    try {
      const response = await axios.post(
        `${this.evolutionUrl}/message/sendText/tenant_${tenantId}`,
        {
          number: number,
          text: text,
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao enviar mensagem no tenant ${tenantId}:`, error?.response?.data || error.message);
      throw new BadRequestException('Falha no disparo de mensagem via WhatsApp.');
    }
  }
}