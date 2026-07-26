import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'uuid-timetable-id' })
  @IsString()
  @IsNotEmpty()
  timetableId: string;

  @ApiProperty({ example: 'Morning Walk' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Walk for 30 mins' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '08:30' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ example: 'daily' })
  @IsString()
  @IsNotEmpty()
  repeatType: string;

  @ApiPropertyOptional({ example: 'health' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;
}
