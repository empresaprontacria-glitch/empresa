"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const openai_1 = require("@langchain/openai");
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
;
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const prisma = new client_1.PrismaClient();
let AiService = class AiService {
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    async trainKnowledgeBase(dto) {
        return await prisma.aiSetting.upsert({
            where: { tenantId: dto.tenantId },
            update: {
                systemPrompt: dto.systemPrompt,
                businessContext: dto.businessContext,
            },
            create: {
                tenantId: dto.tenantId,
                systemPrompt: dto.systemPrompt,
                businessContext: dto.businessContext,
                isAiActive: true,
            },
        });
    }
    async processIncomingMessage(dto) {
        let client = await prisma.customer.findFirst({
            where: { tenantId: dto.tenantId, phone: dto.clientPhone },
        });
        if (!client) {
            client = await prisma.customer.create({
                data: {
                    tenantId: dto.tenantId,
                    name: dto.clientName || 'Cliente WhatsApp',
                    phone: dto.clientPhone,
                },
            });
        }
        const createAppointmentTool = new tools_1.DynamicStructuredTool({
            name: 'createAppointment',
            description: 'Cria um novo agendamento no sistema para o cliente.',
            schema: zod_1.z.object({
                serviceId: zod_1.z.string().describe('ID do serviço escolhido'),
                professionalId: zod_1.z.string().describe('ID do profissional escolhido'),
                dateTimeISO: zod_1.z.string().describe('Data e hora no formato ISO (ex: 2026-08-11T14:00:00Z)'),
            }),
            func: async ({ serviceId, professionalId, dateTimeISO }) => {
                const appointment = await prisma.appointment.create({
                    data: {
                        tenantId: dto.tenantId,
                        customerId: client.id,
                        serviceId: serviceId,
                        professionalId: professionalId,
                        date: new Date(dateTimeISO),
                        status: 'CONFIRMED',
                    },
                });
                return `Agendamento efetuado com sucesso! Código da reserva: ${appointment.id}`;
            },
        });
        const aiSetting = await prisma.aiSetting.findUnique({
            where: { tenantId: dto.tenantId },
        });
        if (!aiSetting || !aiSetting.isAiActive) {
            return { message: 'IA desativada para este tenant.' };
        }
        const model = new openai_1.ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: 'gpt-4o-mini',
            temperature: 0.2,
        }).bindTools([createAppointmentTool]);
        const response = await model.invoke([
            { role: 'system', content: `${aiSetting.systemPrompt}\n\nContexto da Empresa:\n${aiSetting.businessContext}` },
            { role: 'user', content: dto.message },
        ]);
        return { response: response.content };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], AiService);
//# sourceMappingURL=ai.service.js.map