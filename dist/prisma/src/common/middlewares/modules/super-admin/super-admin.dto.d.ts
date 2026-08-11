export declare class CreatePlanDto {
    name: string;
    price: number;
    hasAI: boolean;
    nicheId: string;
}
export declare class CreateTenantDto {
    name: string;
    email: string;
    phone: string;
    document?: string;
    nicheId: string;
    planId: string;
}
export declare class UpdateSubscriptionStatusDto {
    status: string;
}
