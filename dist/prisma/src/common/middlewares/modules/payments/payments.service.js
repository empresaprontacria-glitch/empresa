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
let PaymentsService = class PaymentsService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async createSubscriptionCharge(data) {
        return { success: true, data };
    }
    async handleAsaasWebhook(body) {
        if (body.event === 'PAYMENT_RECEIVED' || body.event === 'PAYMENT_CONFIRMED') {
            const tenantId = body.payment?.externalReference;
            if (tenantId) {
                const nextYear = new Date();
                nextYear.setFullYear(nextYear.getFullYear() + 1);
                await this.prisma.subscription.updateMany({
                    where: { tenantId },
                    data: {
                        status: 'ACTIVE',
                        currentPeriodEnd: nextYear,
                    },
                });
            }
        }
        return { received: true };
    }
    async handlePaymentSuccess(tenantId, planId, durationMonths = 1) {
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + durationMonths);
        const subscription = await this.prisma.subscription.findFirst({
            where: { tenantId },
        });
        if (subscription) {
            return await this.prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    status: 'ACTIVE',
                    currentPeriodEnd,
                    plan: { connect: { id: planId } },
                },
            });
        }
        else {
            return await this.prisma.subscription.create({
                data: {
                    tenant: { connect: { id: tenantId } },
                    plan: { connect: { id: planId } },
                    status: 'ACTIVE',
                    currentPeriodEnd,
                },
            });
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)()
], PaymentsService);
//# sourceMappingURL=payments.service.js.map