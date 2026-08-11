export class CreateInstanceDto {
  tenantId: string;
}

export class SendTextMessageDto {
  tenantId: string;
  number: string; // Ex: 5598986275172
  text: string;
}