import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TaskResponsesService } from './task-responses.service';
import { CreateTaskResponseDto } from './dto/create-task-response.dto';
import { UpdateTaskResponseDto } from './dto/update-task-response.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('TaskResponses')
@Controller('task-responses')
export class TaskResponsesController {
  constructor(private readonly taskResponsesService: TaskResponsesService) {}

  @Post()
  @ApiOperation({ summary: 'Record a behavioural event (completed, missed, etc)' })
  create(@Body() createTaskResponseDto: CreateTaskResponseDto) {
    return this.taskResponsesService.create(createTaskResponseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all task responses, optionally filtered by date' })
  @ApiQuery({ name: 'date', required: false })
  findAll(@Query('date') date?: string) {
    return this.taskResponsesService.findAll(date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task response by ID' })
  findOne(@Param('id') id: string) {
    return this.taskResponsesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific task response' })
  update(@Param('id') id: string, @Body() updateTaskResponseDto: UpdateTaskResponseDto) {
    return this.taskResponsesService.update(id, updateTaskResponseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task response' })
  remove(@Param('id') id: string) {
    return this.taskResponsesService.remove(id);
  }
}
