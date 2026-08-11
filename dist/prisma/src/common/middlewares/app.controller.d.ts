export declare class AppController {
    getHello(): string;
    getTenants(): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        document: string | null;
        status: string;
        nicheId: string;
        planId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
