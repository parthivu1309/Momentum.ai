import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Timetable')
@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new timetable' })
  create(@Body() createTimetableDto: CreateTimetableDto) {
    return this.timetableService.create(createTimetableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all timetables for the user' })
  findAll() {
    return this.timetableService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific timetable by ID' })
  findOne(@Param('id') id: string) {
    return this.timetableService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific timetable' })
  update(@Param('id') id: string, @Body() updateTimetableDto: UpdateTimetableDto) {
    return this.timetableService.update(id, updateTimetableDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a timetable' })
  remove(@Param('id') id: string) {
    return this.timetableService.remove(id);
  }
}
