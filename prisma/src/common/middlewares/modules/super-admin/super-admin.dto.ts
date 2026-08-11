import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  hasAI: boolean;

  @IsString()
  @IsNotEmpty()
  nicheId: string;
}

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  document?: string;

  @IsString()
  @IsNotEmpty()
  nicheId: string;

  @IsString()
  @IsNotEmpty()
  planId: string;
}

export class UpdateSubscriptionStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}