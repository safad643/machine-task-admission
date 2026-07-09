import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamSlot, ExamSlotSchema } from '../exam-slots/exam-slots.schema.js';
import { Student, StudentSchema } from '../students/students.schema.js';
import { AdmissionController } from './admission.controller.js';
import { AdmissionService } from './admission.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: ExamSlot.name, schema: ExamSlotSchema },
    ]),
  ],
  controllers: [AdmissionController],
  providers: [AdmissionService],
  exports: [AdmissionService],
})
export class AdmissionModule {}
