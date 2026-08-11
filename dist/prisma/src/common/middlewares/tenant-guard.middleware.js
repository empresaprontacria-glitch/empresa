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
            throw new common_1.UnauthorizedException('Tenant ID (x-tenant-id) é obrigatório no cabeçalho.');
        }
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            include: {
                subscriptions: {
                    include: { plan: true },
                },
            },
        });
        if (!tenant) {
            throw new common_1.UnauthorizedException('Tenant não encontrado ou inválido.');
        }
        if (tenant.status !== 'ACTIVE') {
            throw new common_1.ForbiddenException('Sua conta ou assinatura está inativa ou suspensa.');
        }
        req.tenant = tenant;
        next();
    }
};
exports.TenantGuardMiddleware = TenantGuardMiddleware;
exports.TenantGuardMiddleware = TenantGuardMiddleware = __decorate([
    (0, common_1.Injectable)()
], TenantGuardMiddleware);
//# sourceMappingURL=tenant-guard.middleware.js.map