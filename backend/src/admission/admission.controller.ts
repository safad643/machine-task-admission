import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { StudentStatus } from '../students/students.schema.js';
import { UserRole } from '../users/users.schema.js';
import { AdmissionService } from './admission.service.js';
import { AssignCourseDto } from './dto/assign-course.dto.js';
import { EnterScoreDto } from './dto/enter-score.dto.js';

@Controller('admission')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMISSION_TEAM)
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Get('applications')
  async findAll(@Query('status') status?: StudentStatus) {
    return this.admissionService.findAll(status);
  }

  @Get('applications/:id')
  async findOne(@Param('id') id: string) {
    return this.admissionService.findOne(id);
  }

  @Patch('applications/:id/score')
  async enterScore(@Param('id') id: string, @Body() dto: EnterScoreDto) {
    return this.admissionService.enterScore(id, dto.score);
  }

  @Patch('applications/:id/assign-course')
  async assignCourse(@Param('id') id: string, @Body() dto: AssignCourseDto) {
    return this.admissionService.assignCourse(id, dto.course);
  }
}
