export declare class SuperAdminService {
    getAllTenants(): Promise<({
        subscriptions: ({
            plan: {
                id: string;
                name: string;
                createdAt: Date;
                price: number;
                hasAI: boolean;
                nicheId: string;
            };
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            status: string;
            planId: string;
            paymentMethod: string;
            currentPeriodEnd: Date;
        })[];
    } & {
        id: string;
        name: string;
        phone: string;
        email: string;
        createdAt: Date;
        status: string;
        nicheId: string;
        document: string | null;
        planId: string;
        updatedAt: Date;
    })[]>;
    getTenantById(id: string): Promise<{
        subscriptions: ({
            plan: {
                id: string;
                name: string;
                createdAt: Date;
                price: number;
                hasAI: boolean;
                nicheId: string;
            };
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            status: string;
            planId: string;
            paymentMethod: string;
            currentPeriodEnd: Date;
        })[];
    } & {
        id: string;
        name: string;
        phone: string;
        email: string;
        createdAt: Date;
        status: string;
        nicheId: string;
        document: string | null;
        planId: string;
        updatedAt: Date;
    }>;
    updateTenantStatus(id: string, status: any): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        createdAt: Date;
        status: string;
        nicheId: string;
        document: string | null;
        planId: string;
        updatedAt: Date;
    }>;
    updateSubscription(subscriptionId: string, data: any): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        status: string;
        planId: string;
        paymentMethod: string;
        currentPeriodEnd: Date;
    }>;
}
