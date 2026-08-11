import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TenantGuardMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // O ID do tenant vem no cabeçalho HTTP da requisição feita pelo App do Salão
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      throw new ForbiddenException('Tenant ID não fornecido no cabeçalho (x-tenant-id).');
    }

    // Busca a assinatura no banco de dados
    const subscription = await prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new ForbiddenException('Tenant não possui uma assinatura vinculada.');
    }

    // REGRA DE BLOQUEIO AUTOMÁTICO
    if (subscription.status === 'OVERDUE') {
      throw new ForbiddenException('Acesso suspenso por pendência financeira. Realize o pagamento para reativar.');
    }

    if (subscription.status === 'CANCELED') {
      throw new ForbiddenException('Esta conta foi cancelada. Entre em contato com o suporte.');
    }

    // Injeta os dados do plano na requisição para que outros módulos saibam se a IA pode ser usada
    req['tenant'] = {
      id: tenantId,
      hasAI: subscription.plan.hasAI,
      maxInstances: subscription.plan.maxInstances,
    };

    next();
  }
}