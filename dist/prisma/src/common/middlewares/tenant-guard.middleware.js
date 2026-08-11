"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantGuardMiddleware = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let TenantGuardMiddleware = class TenantGuardMiddleware {
    async use(req, res, next) {
        const tenantId = req.headers['x-tenant-id'];
        if (!tenantId) {
            throw new common_1.ForbiddenException('Tenant ID não fornecido no cabeçalho (x-tenant-id).');
        }
        const subscription = await prisma.subscription.findUnique({
            where: { tenantId },
            include: { plan: true },
        });
        if (!subscription) {
            throw new common_1.ForbiddenException('Tenant não possui uma assinatura vinculada.');
        }
        if (subscription.status === 'OVERDUE') {
            throw new common_1.ForbiddenException('Acesso suspenso por pendência financeira. Realize o pagamento para reativar.');
        }
        if (subscription.status === 'CANCELED') {
            throw new common_1.ForbiddenException('Esta conta foi cancelada. Entre em contato com o suporte.');
        }
        req['tenant'] = {
            id: tenantId,
            hasAI: subscription.plan.hasAI,
            maxInstances: subscription.plan.maxInstances,
        };
        next();
    }
};
exports.TenantGuardMiddleware = TenantGuardMiddleware;
exports.TenantGuardMiddleware = TenantGuardMiddleware = __decorate([
    (0, common_1.Injectable)()
], TenantGuardMiddleware);
//# sourceMappingURL=tenant-guard.middleware.js.map