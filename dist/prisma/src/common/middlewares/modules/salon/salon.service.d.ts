export declare class SalonService {
    getCustomers(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        phone: string;
        email: string | null;
        notes: string | null;
        createdAt: Date;
    }[]>;
    createProfessional(dto: any): Promise<{
        id: string;
        tenantId: string;
        name: string;
    }>;
    listProfessionals(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
    }[]>;
    createService(dto: any): Promise<{
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
    createAppointment(dto: any): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        status: string;
        serviceId: string;
        professionalId: string;
        date: Date;
        customerId: string;
    }>;
    getAppointments(tenantId: string): Promise<({
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
