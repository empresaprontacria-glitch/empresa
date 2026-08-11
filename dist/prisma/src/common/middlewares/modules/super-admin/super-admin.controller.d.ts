import { SuperAdminService } from './super-admin.service';
import { CreatePlanDto, CreateTenantDto, UpdateSubscriptionStatusDto } from './super-admin.dto';
export declare class SuperAdminController {
    private readonly masterService;
    constructor(masterService: SuperAdminService);
    getDashboardMetrics(): Promise<{
        totalTenants: number;
        activeTenants: number;
        overdueTenants: number;
        mrr: number;
    }>;
    createPlan(dto: CreatePlanDto): Promise<{
        id: string;
        name: string;
        price: number;
        hasAI: boolean;
        maxInstances: number;
    }>;
    listPlans(): Promise<{
        id: string;
        name: string;
        price: number;
        hasAI: boolean;
        maxInstances: number;
    }[]>;
    createTenant(dto: CreateTenantDto): Promise<{
        tenant: {
            id: string;
            name: string;
            document: string | null;
            createdAt: Date;
        };
        subscription: {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            id: string;
            tenantId: string;
            planId: string;
            dueDate: Date;
        };
    }>;
    listTenants(): Promise<({
        subscription: {
            plan: {
                id: string;
                name: string;
                price: number;
                hasAI: boolean;
                maxInstances: number;
            };
        } & {
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            id: string;
            tenantId: string;
            planId: string;
            dueDate: Date;
        };
    } & {
        id: string;
        name: string;
        document: string | null;
        createdAt: Date;
    })[]>;
    updateSubscriptionStatus(tenantId: string, dto: UpdateSubscriptionStatusDto): Promise<{
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        id: string;
        tenantId: string;
        planId: string;
        dueDate: Date;
    }>;
}
