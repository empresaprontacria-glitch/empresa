import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTenantDto } from './super-admin.dto';

const prisma = new PrismaClient();

@Injectable()
export class SuperAdminService {
  // 1. Métricas Globais (Painel Mestre)
  async getMetrics() {
    const totalTenants = await prisma.tenant.count();
    const activeTenants = await prisma.tenant.count({ where: { status: 'ACTIVE' } });
    const pendingTenants = await prisma.tenant.count({ where: { status: 'PENDING' } });
    
    const activeSubscriptions = await prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      include: { plan: true },
    });
    
    const mrr = activeSubscriptions.reduce((acc, sub) => acc + (sub.plan?.price || 0), 0);

    return {
      totalTenants,
      activeTenants,
      pendingTenants,
      mrr,
    };
  }

  // 2. Criar Plano
  async createPlan(dto: { name: string; price: number; hasAI: boolean; nicheId: string }) {
    return await prisma.plan.create({
      data: {
        name: dto.name,
        price: dto.price,
        hasAI: dto.hasAI,
        nicheId: dto.nicheId,
      },
    });
  }

  // 3. Listar Planos
  async listPlans() {
    return await prisma.plan.findMany({
      include: { niche: true },
    });
  }

  // 4. Criar Tenant com Assinatura
  async createTenantWithSubscription(dto: CreateTenantDto) {
    const emailExists = await prisma.tenant.findUnique({
      where: { email: dto.email },
    });

    if (emailExists) {
      throw new BadRequestException('E-mail já cadastrado na plataforma.');
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    return await prisma.tenant.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        document: dto.document,
        nicheId: dto.nicheId,
        planId: dto.planId,
        status: 'PENDING',
        subscriptions: {
          create: {
            planId: dto.planId,
            status: 'PENDING',
            currentPeriodEnd: dueDate,
          },
        },
        aiSettings: {
          create: {
            systemPrompt: `Você é o assistente virtual da empresa ${dto.name}.`,
            businessContext: `Nome: ${dto.name}. Telefone: ${dto.phone}`,
            isAiActive: true,
          },
        },
      },
    });
  }

  // 5. Listar Tenants
  async listTenants() {
    return await prisma.tenant.findMany({
      include: {
        niche: true,
        plan: true,
        subscriptions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 6. Atualizar Status da Assinatura / Tenant
  async updateSubscriptionStatus(tenantId: string, status: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant não encontrado.');

    await prisma.tenant.update({
      where: { id: tenantId },
      data: { status },
    });

    return await prisma.subscription.update({
      where: { tenantId },
      data: { status },
    });
  }
}