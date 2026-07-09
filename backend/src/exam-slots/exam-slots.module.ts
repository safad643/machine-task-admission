import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from '../students/students.schema.js';
import { ExamSlotsController } from './exam-slots.controller.js';
import { ExamSlot, ExamSlotSchema } from './exam-slots.schema.js';
import { ExamSlotsService } from './exam-slots.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamSlot.name, schema: ExamSlotSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [ExamSlotsController],
  providers: [ExamSlotsService],
  exports: [ExamSlotsService],
})
export class ExamSlotsModule {}
