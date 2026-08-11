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
exports.SalonController = void 0;
const common_1 = require("@nestjs/common");
const salon_service_1 = require("./salon.service");
const salon_dto_1 = require("./salon.dto");
let SalonController = class SalonController {
    constructor(salonService) {
        this.salonService = salonService;
    }
    async createProfessional(dto) {
        return await this.salonService.createProfessional(dto);
    }
    async listProfessionals(tenantId) {
        return await this.salonService.listProfessionals(tenantId);
    }
    async createService(dto) {
        return await this.salonService.createService(dto);
    }
    async listServices(tenantId) {
        return await this.salonService.listServices(tenantId);
    }
    async createAppointment(dto) {
        return await this.salonService.createAppointment(dto);
    }
    async listAppointments(tenantId) {
        return await this.salonService.listAppointments(tenantId);
    }
};
exports.SalonController = SalonController;
__decorate([
    (0, common_1.Post)('professionals'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [salon_dto_1.CreateProfessionalDto]),
    __metadata("design:returntype", Promise)
], SalonController.prototype, "createProfessional", null);
__decorate([
    (0, common_1.Get)('professionals/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalonController.prototype, "listProfessionals", null);
__decorate([
    (0, common_1.Post)('services'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [salon_dto_1.CreateServiceDto]),
    __metadata("design:returntype", Promise)
], SalonController.prototype, "createService", null);
__decorate([
    (0, common_1.Get)('services/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalonController.prototype, "listServices", null);
__decorate([
    (0, common_1.Post)('appointments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [salon_dto_1.CreateAppointmentDto]),
    __metadata("design:returntype", Promise)
], SalonController.prototype, "createAppointment", null);
__decorate([
    (0, common_1.Get)('appointments/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalonController.prototype, "listAppointments", null);
exports.SalonController = SalonController = __decorate([
    (0, common_1.Controller)('api/v1/salon'),
    __metadata("design:paramtypes", [salon_service_1.SalonService])
], SalonController);
//# sourceMappingURL=salon.controller.js.map