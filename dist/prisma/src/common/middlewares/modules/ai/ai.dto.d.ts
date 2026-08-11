export declare class TrainAiDto {
    tenantId: string;
    content: string;
}
export declare class ProcessMessageDto {
    tenantId: string;
    clientPhone: string;
    clientName?: string;
    message: string;
}
export declare class UpdateAiSettingsDto {
    tenantId: string;
    businessRules: string;
    isAIActive: boolean;
}
