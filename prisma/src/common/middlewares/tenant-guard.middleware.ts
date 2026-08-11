import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TenantGuardMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID (x-tenant-id) é obrigatório no cabeçalho.');
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
      throw new UnauthorizedException('Tenant não encontrado ou inválido.');
    }

    if (tenant.status !== 'ACTIVE') {
      throw new ForbiddenException('Sua conta ou assinatura está inativa ou suspensa.');
    }

    (req as any).tenant = tenant;
    next();
  }
}