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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminController = void 0;
const common_1 = require("@nestjs/common");
const super_admin_service_1 = require("./super-admin.service");
const super_admin_dto_1 = require("./super-admin.dto");
let SuperAdminController = class SuperAdminController {
    constructor(masterService) {
        this.masterService = masterService;
    }
    async getDashboardMetrics() {
        return await this.masterService.getMetrics();
    }
    async createPlan(dto) {
        return await this.masterService.createPlan(dto);
    }
    async listPlans() {
        return await this.masterService.listPlans();
    }
    async createTenant(dto) {
        return await this.masterService.createTenantWithSubscription(dto);
    }
    async listTenants() {
        return await this.masterService.listTenants();
    }
    async updateSubscriptionStatus(tenantId, dto) {
        return await this.masterService.updateSubscriptionStatus(tenantId, dto.status);
    }
};
exports.SuperAdminController = SuperAdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getDashboardMetrics", null);
__decorate([
    (0, common_1.Post)('plans'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [super_admin_dto_1.CreatePlanDto]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Get)('plans'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "listPlans", null);
__decorate([
    (0, common_1.Post)('tenants'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [super_admin_dto_1.CreateTenantDto]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "createTenant", null);
__decorate([
    (0, common_1.Get)('tenants'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "listTenants", null);
__decorate([
    (0, common_1.Put)('tenants/:tenantId/subscription-status'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, super_admin_dto_1.UpdateSubscriptionStatusDto]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "updateSubscriptionStatus", null);
exports.SuperAdminController = SuperAdminController = __decorate([
    (0, common_1.Controller)('api/v1/master'),
    __metadata("design:paramtypes", [super_admin_service_1.SuperAdminService])
], SuperAdminController);
//# sourceMappingURL=super-admin.controller.js.map