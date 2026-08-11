export declare class CreateProfessionalDto {
    tenantId: string;
    name: string;
}
export declare class CreateServiceDto {
    tenantId: string;
    name: string;
    price: number;
    durationMin: number;
}
export declare class CreateAppointmentDto {
    tenantId: string;
    clientName: string;
    clientPhone: string;
    professionalId: string;
    serviceId: string;
    dateTime: string;
}
