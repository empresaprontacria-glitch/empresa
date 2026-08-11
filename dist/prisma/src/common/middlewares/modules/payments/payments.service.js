"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let PaymentsService = class PaymentsService {
    async createSubscriptionCharge(dto) {
        const tenant = await prisma.tenant.findUnique({
            where: { id: dto.tenantId },
        });
        const plan = await prisma.plan.findUnique({
            where: { id: dto.planId },
        });
        if (!tenant || !plan) {
            throw new common_1.NotFoundException('Salão ou Plano não encontrado.');
        }
        return {
            message: 'Cobrança gerada com sucesso.',
            pixQrCode: '00020126580014BR.GOV.BCB.PIX...',
            value: plan.price,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };
    }
    async handleAsaasWebhook(payload) {
        const { event, payment } = payload;
        const tenantId = payment.externalReference;
        if (!tenantId) {
            throw new common_1.BadRequestException('Webhook recebido sem identificador de tenant (externalReference).');
        }
        if (event === 'PAYMENT_RECEIVED') {
            const newDueDate = new Date();
            newDueDate.setDate(newDueDate.getDate() + 30);
            await prisma.subscription.update({
                where: { tenantId },
                data: {
                    status: client_1.SubscriptionStatus.ACTIVE,
                    dueDate: newDueDate,
                },
            });
            console.log(`[PAGAMENTO CONFIRMADO] Tenant ${tenantId} ativado até ${newDueDate.toISOString()}`);
            return { success: true, message: 'Assinatura reativada/renovada.' };
        }
        if (event === 'PAYMENT_OVERDUE') {
            await prisma.subscription.update({
                where: { tenantId },
                data: {
                    status: client_1.SubscriptionStatus.OVERDUE,
                },
            });
            console.log(`[INADIMPLÊNCIA] Tenant ${tenantId} foi suspenso por falta de pagamento.`);
            return { success: true, message: 'Assinatura suspensa.' };
        }
        return { success: true, message: 'Evento ignorado sem alterações.' };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)()
], PaymentsService);
//# sourceMappingURL=payments.service.js.map