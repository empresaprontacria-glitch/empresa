"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let WhatsappService = class WhatsappService {
    constructor() {
        this.evolutionUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
        this.apiKey = process.env.EVOLUTION_API_KEY || 'sua_chave_secreta_aqui_123';
    }
    get headers() {
        return {
            'Content-Type': 'application/json',
            'apikey': this.apiKey,
        };
    }
    async createInstance(tenantId) {
        try {
            const response = await axios_1.default.post(`${this.evolutionUrl}/instance/create`, {
                instanceName: `tenant_${tenantId}`,
                token: tenantId,
                qrcode: true,
                integration: 'WHATSAPP-BAILEYS',
            }, { headers: this.headers });
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException('Erro ao criar instância de WhatsApp: ' + error?.message);
        }
    }
    async getQrCode(tenantId) {
        try {
            const response = await axios_1.default.get(`${this.evolutionUrl}/instance/connect/tenant_${tenantId}`, { headers: this.headers });
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException('Erro ao buscar QR Code. Verifique se a instância foi criada.');
        }
    }
    async sendMessage(tenantId, number, text) {
        try {
            const response = await axios_1.default.post(`${this.evolutionUrl}/message/sendText/tenant_${tenantId}`, {
                number: number,
                text: text,
            }, { headers: this.headers });
            return response.data;
        }
        catch (error) {
            console.error(`Erro ao enviar mensagem no tenant ${tenantId}:`, error?.response?.data || error.message);
            throw new common_1.BadRequestException('Falha no disparo de mensagem via WhatsApp.');
        }
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)()
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map