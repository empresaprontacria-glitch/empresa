import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SalonService {
  // 1. Clientes
  async getCustomers(tenantId: string) {
    return await prisma.customer.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 2. Profissionais (Recebendo 1 argumento: dto)
  async createProfessional(dto: any) {
    return await prisma.professional.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name,
      },
    });
  }

  async listProfessionals(tenantId: string) {
    return await prisma.professional.findMany({
      where: { tenantId },
    });
  }

  // 3. Serviços (Recebendo 1 argumento: dto)
  async createService(dto: any) {
    return await prisma.service.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name,
        price: typeof dto.price === 'string' ? parseFloat(dto.price) : dto.price,
        duration: typeof dto.duration === 'string' ? parseInt(dto.duration, 10) : (dto.duration || 30),
      },
    });
  }

  async listServices(tenantId: string) {
    return await prisma.service.findMany({
      where: { tenantId },
    });
  }

  // 4. Agendamentos (Recebendo 1 argumento: dto)
  async createAppointment(dto: any) {
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

  async getAppointments(tenantId: string) {
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

  async listAppointments(tenantId: string) {
    return await this.getAppointments(tenantId);
  }
}