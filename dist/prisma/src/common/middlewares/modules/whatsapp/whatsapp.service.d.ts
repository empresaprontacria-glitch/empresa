export declare class WhatsappService {
    private readonly evolutionUrl;
    private readonly apiKey;
    private get headers();
    createInstance(tenantId: string): Promise<any>;
    getQrCode(tenantId: string): Promise<any>;
    sendMessage(tenantId: string, number: string, text: string): Promise<any>;
}
