import { SubscriptionStatus } from '@prisma/client';
export declare class CreatePlanDto {
    name: string;
    price: number;
    hasAI: boolean;
    maxInstances?: number;
}
export declare class CreateTenantDto {
    name: string;
    document?: string;
    planId: string;
    hasAI: boolean;
}
export declare class UpdateSubscriptionStatusDto {
    status: SubscriptionStatus;
}
