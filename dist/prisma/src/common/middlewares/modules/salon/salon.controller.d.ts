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
        duration: number;
    }>;
    listServices(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        price: number;
        duration: number;
    }[]>;
    createAppointment(dto: CreateAppointmentDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        status: string;
        serviceId: string;
        professionalId: string;
        date: Date;
        customerId: string;
    }>;
    listAppointments(tenantId: string): Promise<({
        customer: {
            id: string;
            tenantId: string;
            name: string;
            phone: string;
            email: string | null;
            notes: string | null;
            createdAt: Date;
        };
        service: {
            id: string;
            tenantId: string;
            name: string;
            price: number;
            duration: number;
        };
        professional: {
            id: string;
            tenantId: string;
            name: string;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        status: string;
        serviceId: string;
        professionalId: string;
        date: Date;
        customerId: string;
    })[]>;
}
