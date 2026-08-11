import { Controller, Get } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return '🚀 API Empresa Pronta rodando com sucesso no Railway!';
  }

  @Get('tenants')
  async getTenants() {
    return await prisma.tenant.findMany();
  }
}