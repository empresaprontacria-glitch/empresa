import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TrainAiDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  systemPrompt: string;

  @IsString()
  @IsNotEmpty()
  businessContext: string;
}

export class ProcessMessageDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  clientPhone: string;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}