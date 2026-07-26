import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  type: string; // 'daily', 'weekly', 'monthly'

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsObject()
  @IsOptional()
  analyticsSnapshot?: any;

  @IsString()
  @IsOptional()
  aiSummary?: string;
}
