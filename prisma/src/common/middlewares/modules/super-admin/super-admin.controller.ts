import { Controller, Get, Post, Put, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { CreatePlanDto, CreateTenantDto, UpdateSubscriptionStatusDto } from './super-admin.dto';

// Em produção, proteger esta rota com Guard de Autenticação JWT do Super Admin
@Controller('api/v1/master')
export class SuperAdminController {
  constructor(private readonly masterService: SuperAdminService) {}

  // 1. DASHBOARD - Métricas Gerais do SaaS
  @Get('dashboard')
  async getDashboardMetrics() {
    return await this.masterService.getMetrics();
  }

  // 2. GESTÃO DE PLANOS
  @Post('plans')
  async createPlan(@Body() dto: CreatePlanDto) {
    return await this.masterService.createPlan(dto);
  }

  @Get('plans')
  async listPlans() {
    return await this.masterService.listPlans();
  }

  // 3. GESTÃO DE TENANTS (SALÕES DE BELEZA)
  @Post('tenants')
  async createTenant(@Body() dto: CreateTenantDto) {
    return await this.masterService.createTenantWithSubscription(dto);
  }

  @Get('tenants')
  async listTenants() {
    return await this.masterService.listTenants();
  }

  // 4. CONTROLE DE STATUS DA ASSINATURA (Ativo / Inadimplente / Cancelado)
  @Put('tenants/:tenantId/subscription-status')
  async updateSubscriptionStatus(
    @Param('tenantId') tenantId: string,
    @Body() dto: UpdateSubscriptionStatusDto,
  ) {
    return await this.masterService.updateSubscriptionStatus(tenantId, dto.status);
  }
}