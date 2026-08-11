import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ChatOpenAI } from '@langchain/openai';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { ProcessMessageDto, TrainAiDto } from './ai.dto';;
import { WhatsappService } from '../whatsapp/whatsapp.service';

const prisma = new PrismaClient();

@Injectable()
export class AiService {
  constructor(private readonly whatsappService: WhatsappService) {}

 // 1. Método para Treinar/Atualizar a Base de Conhecimento da IA usando o DTO
async trainKnowledgeBase(dto: TrainAiDto) {
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

  // 2. Método de Processamento das Mensagens da IA (FACILITAZAP)
  async processIncomingMessage(dto: ProcessMessageDto) {
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

    const createAppointmentTool = new DynamicStructuredTool({
      name: 'createAppointment',
      description: 'Cria um novo agendamento no sistema para o cliente.',
      schema: z.object({
        serviceId: z.string().describe('ID do serviço escolhido'),
        professionalId: z.string().describe('ID do profissional escolhido'),
        dateTimeISO: z.string().describe('Data e hora no formato ISO (ex: 2026-08-11T14:00:00Z)'),
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

    const model = new ChatOpenAI({
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
}