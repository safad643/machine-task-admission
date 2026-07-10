import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserRole } from '../users/users.schema.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { StudentsService } from './students.service.js';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PARENT)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(
    @Body() dto: CreateStudentDto,
    @CurrentUser('_id') parentId: string,
  ) {
    return this.studentsService.create(dto, parentId);
  }

  @Get()
  async findAll(
    @CurrentUser('_id') parentId: string,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    return this.studentsService.findAllByParent(parentId, parsedLimit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('_id') parentId: string) {
    return this.studentsService.findByIdAndParent(id, parentId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
    @CurrentUser('_id') parentId: string,
  ) {
    return this.studentsService.update(id, dto, parentId);
  }

  @Post(':id/registration-fee')
  async payRegistrationFee(
    @Param('id') id: string,
    @CurrentUser('_id') parentId: string,
  ) {
    return this.studentsService.payRegistrationFee(id, parentId);
  }
}
