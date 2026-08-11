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
exports.WhatsappController = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("./whatsapp.service");
const whatsapp_dto_1 = require("./whatsapp.dto");
let WhatsappController = class WhatsappController {
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    async createInstance(dto) {
        return await this.whatsappService.createInstance(dto.tenantId);
    }
    async getQrCode(tenantId) {
        return await this.whatsappService.getQrCode(tenantId);
    }
    async sendMessage(dto) {
        return await this.whatsappService.sendMessage(dto.tenantId, dto.number, dto.text);
    }
};
exports.WhatsappController = WhatsappController;
__decorate([
    (0, common_1.Post)('instance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [whatsapp_dto_1.CreateInstanceDto]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "createInstance", null);
__decorate([
    (0, common_1.Get)('qrcode/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "getQrCode", null);
__decorate([
    (0, common_1.Post)('send-text'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [whatsapp_dto_1.SendTextMessageDto]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "sendMessage", null);
exports.WhatsappController = WhatsappController = __decorate([
    (0, common_1.Controller)('api/v1/whatsapp'),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], WhatsappController);
//# sourceMappingURL=whatsapp.controller.js.map