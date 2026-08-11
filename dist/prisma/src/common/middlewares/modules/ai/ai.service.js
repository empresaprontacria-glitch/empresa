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
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const prisma = new client_1.PrismaClient();
let AiService = class AiService {
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    async trainKnowledgeBase(dto) {
        const embeddings = new openai_1.OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: 'text-embedding-3-small',
        });
        const vector = await embeddings.embedQuery(dto.content);
        const vectorString = `[${vector.join(',')}]`;
        await prisma.$executeRawUnsafe(`INSERT INTO "DocumentEmbedding" ("id", "tenantId", "content", "embedding") 
       VALUES (gen_random_uuid(), $1, $2, $3::vector)`, dto.tenantId, dto.content, vectorString);
        return { success: true, message: 'Base de conhecimento da IA atualizada com sucesso!' };
    }
    async searchKnowledgeBase(tenantId, query) {
        const embeddings = new openai_1.OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: 'text-embedding-3-small',
        });
        const queryVector = await embeddings.embedQuery(query);
        const vectorString = `[${queryVector.join(',')}]`;
        const results = await prisma.$queryRawUnsafe(`SELECT "content" FROM "DocumentEmbedding" 
       WHERE "tenantId" = $1 
       ORDER BY "embedding" <-> $2::vector 
       LIMIT 3`, tenantId, vectorString);
        return results.map((r) => r.content).join('\n---\n');
    }
    async processIncomingMessage(dto) {
        const settings = await prisma.aISettings.findUnique({
            where: { tenantId: dto.tenantId },
        });
        if (settings && !settings.isAIActive) {
            return { status: 'ai_disabled' };
        }
        const knowledgeContext = await this.searchKnowledgeBase(dto.tenantId, dto.message);
        const getSalonInfoTool = new tools_1.DynamicStructuredTool({
            name: 'get_salon_catalog',
            description: 'Retorna a lista de serviços e profissionais cadastrados no salão.',
            schema: zod_1.z.object({}),
            func: async () => {
                const services = await prisma.service.findMany({ where: { tenantId: dto.tenantId } });
                const professionals = await prisma.professional.findMany({ where: { tenantId: dto.tenantId } });
                return JSON.stringify({ services, professionals });
            },
        });
        const createAppointmentTool = new tools_1.DynamicStructuredTool({
            name: 'create_appointment',
            description: 'Cria um novo agendamento de serviço na agenda do salão.',
            schema: zod_1.z.object({
                serviceId: zod_1.z.string().describe('ID do serviço'),
                professionalId: zod_1.z.string().describe('ID do profissional'),
                dateTimeISO: zod_1.z.string().describe('Data e Hora no formato ISO String (ex: 2026-08-15T14:00:00Z)'),
            }),
            func: async ({ serviceId, professionalId, dateTimeISO }) => {
                let client = await prisma.client.findFirst({
                    where: { tenantId: dto.tenantId, phone: dto.clientPhone },
                });
                if (!client) {
                    client = await prisma.client.create({
                        data: {
                            tenantId: dto.tenantId,
                            name: dto.clientName || 'Cliente WhatsApp',
                            phone: dto.clientPhone,
                        },
                    });
                }
                const appointment = await prisma.appointment.create({
                    data: {
                        tenantId: dto.tenantId,
                        clientId: client.id,
                        serviceId,
                        professionalId,
                        dateTime: new Date(dateTimeISO),
                        status: 'CONFIRMED',
                    },
                });
                return `Agendamento efetuado com sucesso! Código da reserva: ${appointment.id}`;
            },
        });
        const model = new openai_1.ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: 'gpt-4o-mini',
            temperature: 0.2,
        }).bindTools([getSalonInfoTool, createAppointmentTool]);
        const systemPrompt = `Você é a atendente virtual de inteligência artificial do salão de beleza.
Seu objetivo é ser amigável, tirar dúvidas dos clientes e realizar agendamentos de forma autônoma.

Regras e Informações Gerais do Salão:
${settings?.businessRules || ''}

Base de Conhecimento Adicional (RAG):
${knowledgeContext}

Sempre utilize as ferramentas disponíveis para consultar serviços, profissionais e realizar o agendamento correto no banco do salão.`;
        const response = await model.invoke([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: dto.message },
        ]);
        let aiReplyText = '';
        if (response.tool_calls && response.tool_calls.length > 0) {
            for (const toolCall of response.tool_calls) {
                let toolOutput = '';
                if (toolCall.name === 'get_salon_catalog') {
                    toolOutput = await getSalonInfoTool.invoke({});
                }
                else if (toolCall.name === 'create_appointment') {
                    const result = await createAppointmentTool.invoke(toolCall.args);
                    toolOutput = typeof result === 'string' ? result : JSON.stringify(result.content || result);
                }
                const secondResponse = await model.invoke([
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: dto.message },
                    response,
                    {
                        role: 'tool',
                        tool_call_id: toolCall.id,
                        content: toolOutput,
                    },
                ]);
                aiReplyText = secondResponse.content;
            }
        }
        else {
            aiReplyText = response.content;
        }
        if (aiReplyText) {
            await this.whatsappService.sendMessage(dto.tenantId, dto.clientPhone, aiReplyText);
        }
        return { success: true, reply: aiReplyText };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], AiService);
//# sourceMappingURL=ai.service.js.map