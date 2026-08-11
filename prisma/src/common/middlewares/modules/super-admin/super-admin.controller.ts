import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';

@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('tenants')
  async getAllTenants() {
    return this.superAdminService.getAllTenants();
  }

  @Get('tenants/:id')
  async getTenantById(@Param('id') id: string) {
    return this.superAdminService.getTenantById(id);
  }

  @Patch('tenants/:id/status')
  async updateTenantStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.superAdminService.updateTenantStatus(id, status);
  }

  @Patch('subscriptions/:id')
  async updateSubscription(@Param('id') id: string, @Body() body: any) {
    return this.superAdminService.updateSubscription(id, body);
  }
}