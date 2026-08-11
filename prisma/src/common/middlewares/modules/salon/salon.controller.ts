import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { SalonService } from './salon.service';
import { CreateAppointmentDto, CreateProfessionalDto, CreateServiceDto } from './salon.dto';

@Controller('api/v1/salon')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  // Cadastrar / Listar Profissionais
  @Post('professionals')
  async createProfessional(@Body() dto: CreateProfessionalDto) {
    return await this.salonService.createProfessional(dto);
  }

  @Get('professionals/:tenantId')
  async listProfessionals(@Param('tenantId') tenantId: string) {
    return await this.salonService.listProfessionals(tenantId);
  }

  // Cadastrar / Listar Serviços
  @Post('services')
  async createService(@Body() dto: CreateServiceDto) {
    return await this.salonService.createService(dto);
  }

  @Get('services/:tenantId')
  async listServices(@Param('tenantId') tenantId: string) {
    return await this.salonService.listServices(tenantId);
  }

  // Criar / Listar Agendamentos
  @Post('appointments')
  async createAppointment(@Body() dto: CreateAppointmentDto) {
    return await this.salonService.createAppointment(dto);
  }

  @Get('appointments/:tenantId')
  async listAppointments(@Param('tenantId') tenantId: string) {
    return await this.salonService.listAppointments(tenantId);
  }
}