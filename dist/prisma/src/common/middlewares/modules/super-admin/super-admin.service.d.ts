import { SubscriptionStatus } from '@prisma/client';
import { CreatePlanDto, CreateTenantDto } from './super-admin.dto';
export declare class SuperAdminService {
    getMetrics(): Promise<{
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
    createTenantWithSubscription(dto: CreateTenantDto): Promise<{
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
    updateSubscriptionStatus(tenantId: string, status: SubscriptionStatus): Promise<{
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        id: string;
        tenantId: string;
        planId: string;
        dueDate: Date;
    }>;
}
