import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SuperAdminService {
  async getAllTenants() {
    return prisma.tenant.findMany({
      include: {
        subscriptions: {
          include: { plan: true },
        },
      },
    });
  }

  async getTenantById(id: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        subscriptions: {
          include: { plan: true },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant não encontrado.');
    }

    return tenant;
  }

  async updateTenantStatus(id: string, status: any) {
    return prisma.tenant.update({
      where: { id },
      data: { status },
    });
  }

  async updateSubscription(subscriptionId: string, data: any) {
    return prisma.subscription.update({
      where: { id: subscriptionId },
      data,
    });
  }
}