"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let SuperAdminService = class SuperAdminService {
    async getMetrics() {
        const totalTenants = await prisma.tenant.count();
        const activeSubscriptions = await prisma.subscription.findMany({
            where: { status: 'ACTIVE' },
            include: { plan: true },
        });
        const overdueTenants = await prisma.subscription.count({
            where: { status: 'OVERDUE' },
        });
        const mrr = activeSubscriptions.reduce((acc, sub) => acc + sub.plan.price, 0);
        return {
            totalTenants,
            activeTenants: activeSubscriptions.length,
            overdueTenants,
            mrr: Number(mrr.toFixed(2)),
        };
    }
    async createPlan(dto) {
        return await prisma.plan.create({
            data: {
                name: dto.name,
                price: dto.price,
                hasAI: dto.hasAI,
                maxInstances: dto.maxInstances || 1,
            },
        });
    }
    async listPlans() {
        return await prisma.plan.findMany();
    }
    async createTenantWithSubscription(dto) {
        return await prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    name: dto.name,
                    document: dto.document,
                },
            });
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 30);
            const subscription = await tx.subscription.create({
                data: {
                    tenantId: tenant.id,
                    planId: dto.planId,
                    status: client_1.SubscriptionStatus.ACTIVE,
                    dueDate: dueDate,
                },
            });
            await tx.aISettings.create({
                data: {
                    tenantId: tenant.id,
                    businessRules: "Endereço padrão. Horário de funcionamento das 08h às 18h.",
                    isAIActive: dto.hasAI,
                },
            });
            return { tenant, subscription };
        });
    }
    async listTenants() {
        return await prisma.tenant.findMany({
            include: {
                subscription: {
                    include: {
                        plan: true,
                    },
                },
            },
        });
    }
    async updateSubscriptionStatus(tenantId, status) {
        const subscription = await prisma.subscription.findUnique({
            where: { tenantId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Assinatura não encontrada para este tenant.');
        }
        return await prisma.subscription.update({
            where: { tenantId },
            data: { status },
        });
    }
};
exports.SuperAdminService = SuperAdminService;
exports.SuperAdminService = SuperAdminService = __decorate([
    (0, common_1.Injectable)()
], SuperAdminService);
//# sourceMappingURL=super-admin.service.js.map