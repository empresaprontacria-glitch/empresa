export class CreateProfessionalDto {
  tenantId: string;
  name: string;
}

export class CreateServiceDto {
  tenantId: string;
  name: string;
  price: number;
  durationMin: number; // Ex: 30, 45, 60
}

export class CreateAppointmentDto {
  tenantId: string;
  clientName: string;
  clientPhone: string;
  professionalId: string;
  serviceId: string;
  dateTime: string; // ISO String (ex: 2026-08-11T14:00:00Z)
}