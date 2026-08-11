"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalonService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let SalonService = class SalonService {
    async getCustomers(tenantId) {
        return await prisma.customer.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createProfessional(dto) {
        return await prisma.professional.create({
            data: {
                tenantId: dto.tenantId,
                name: dto.name,
            },
        });
    }
    async listProfessionals(tenantId) {
        return await prisma.professional.findMany({
            where: { tenantId },
        });
    }
    async createService(dto) {
        return await prisma.service.create({
            data: {
                tenantId: dto.tenantId,
                name: dto.name,
                price: typeof dto.price === 'string' ? parseFloat(dto.price) : dto.price,
                duration: typeof dto.duration === 'string' ? parseInt(dto.duration, 10) : (dto.duration || 30),
            },
        });
    }
    async listServices(tenantId) {
        return await prisma.service.findMany({
            where: { tenantId },
        });
    }
    async createAppointment(dto) {
        return await prisma.appointment.create({
            data: {
                tenantId: dto.tenantId,
                customerId: dto.customerId || dto.clientId,
                serviceId: dto.serviceId,
                professionalId: dto.professionalId,
                date: new Date(dto.date || dto.dateTime),
                status: dto.status || 'CONFIRMED',
            },
        });
    }
    async getAppointments(tenantId) {
        return await prisma.appointment.findMany({
            where: { tenantId },
            include: {
                customer: true,
                service: true,
                professional: true,
            },
            orderBy: { date: 'asc' },
        });
    }
    async listAppointments(tenantId) {
        return await this.getAppointments(tenantId);
    }
};
exports.SalonService = SalonService;
exports.SalonService = SalonService = __decorate([
    (0, common_1.Injectable)()
], SalonService);
//# sourceMappingURL=salon.service.js.map