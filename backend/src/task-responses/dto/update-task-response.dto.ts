import { PartialType } from '@nestjs/swagger';
import { CreateTaskResponseDto } from './create-task-response.dto';

export class UpdateTaskResponseDto extends PartialType(CreateTaskResponseDto) {}
