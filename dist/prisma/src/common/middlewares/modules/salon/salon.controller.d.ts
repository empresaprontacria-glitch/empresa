import { SalonService } from './salon.service';
import { CreateAppointmentDto, CreateProfessionalDto, CreateServiceDto } from './salon.dto';
export declare class SalonController {
    private readonly salonService;
    constructor(salonService: SalonService);
    createProfessional(dto: CreateProfessionalDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
    }>;
    listProfessionals(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
    }[]>;
    createService(dto: CreateServiceDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        price: number;
        durationMin: number;
    }>;
    listServices(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        price: number;
        durationMin: number;
    }[]>;
    createAppointment(dto: CreateAppointmentDto): Promise<{
        service: {
            id: string;
            tenantId: string;
            name: string;
            price: number;
            durationMin: number;
        };
        professional: {
            id: string;
            tenantId: string;
            name: string;
        };
        client: {
            id: string;
            tenantId: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        tenantId: string;
        status: string;
        serviceId: string;
        professionalId: string;
        dateTime: Date;
        clientId: string;
    }>;
    listAppointments(tenantId: string): Promise<({
        service: {
            id: string;
            tenantId: string;
            name: string;
            price: number;
            durationMin: number;
        };
        professional: {
            id: string;
            tenantId: string;
            name: string;
        };
        client: {
            id: string;
            tenantId: string;
            name: string;
            phone: string;
        };
    } & {
        id: string;
        tenantId: string;
        status: string;
        serviceId: string;
        professionalId: string;
        dateTime: Date;
        clientId: string;
    })[]>;
}
