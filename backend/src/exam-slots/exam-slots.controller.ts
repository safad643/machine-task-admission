import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserRole } from '../users/users.schema.js';
import { BookExamSlotDto } from './dto/book-exam-slot.dto.js';
import { CreateExamSlotDto } from './dto/create-exam-slot.dto.js';
import { ExamSlotsService } from './exam-slots.service.js';

@Controller('exam-slots')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamSlotsController {
  constructor(private readonly examSlotsService: ExamSlotsService) {}

  @Post()
  @Roles(UserRole.ADMISSION_TEAM)
  async create(@Body() dto: CreateExamSlotDto) {
    return this.examSlotsService.create(dto);
  }

  @Get()
  @Roles(UserRole.PARENT)
  async findAvailable() {
    return this.examSlotsService.findAvailable();
  }

  @Get('all')
  @Roles(UserRole.ADMISSION_TEAM)
  async findAll() {
    return this.examSlotsService.findAll();
  }

  @Post(':id/book')
  @Roles(UserRole.PARENT)
  async book(
    @Param('id') id: string,
    @Body() dto: BookExamSlotDto,
    @CurrentUser('_id') parentId: string,
  ) {
    return this.examSlotsService.bookSlot(id, dto, parentId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMISSION_TEAM)
  async remove(@Param('id') id: string) {
    await this.examSlotsService.remove(id);
    return { message: 'Slot deleted successfully' };
  }
}
