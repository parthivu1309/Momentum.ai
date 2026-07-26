import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskResponseDto {
  @ApiProperty({ example: 'uuid-task-id' })
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @ApiProperty({ example: '2026-07-26' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'completed' })
  @IsString()
  @IsNotEmpty()
  status: string; // "completed", "missed", "snoozed", "skipped"

  @ApiPropertyOptional({ example: 'Too tired' })
  @IsString()
  @IsOptional()
  reason?: string;
}
