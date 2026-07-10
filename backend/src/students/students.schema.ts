import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum StudentStatus {
  APPLICATION_CREATED = 'APPLICATION_CREATED',
  REGISTRATION_FEE_PAID = 'REGISTRATION_FEE_PAID',
  SLOT_BOOKED = 'SLOT_BOOKED',
  EXAM_COMPLETED = 'EXAM_COMPLETED',
  ADMISSION_COMPLETED = 'ADMISSION_COMPLETED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum Course {
  SCIENCE = 'SCIENCE',
  COMMERCE = 'COMMERCE',
  ARTS = 'ARTS',
}

export enum Grade {
  GRADE_1 = 'GRADE_1',
  GRADE_2 = 'GRADE_2',
  GRADE_3 = 'GRADE_3',
  GRADE_4 = 'GRADE_4',
  GRADE_5 = 'GRADE_5',
  GRADE_6 = 'GRADE_6',
  GRADE_7 = 'GRADE_7',
  GRADE_8 = 'GRADE_8',
  GRADE_9 = 'GRADE_9',
  GRADE_10 = 'GRADE_10',
  GRADE_11 = 'GRADE_11',
  GRADE_12 = 'GRADE_12',
}

export type StudentDocument = HydratedDocument<Student>;

@Schema({
  timestamps: true,
})
export class Student {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  parentId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  studentName: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({
    required: true,
    enum: Gender,
  })
  gender: Gender;

  @Prop({ required: true, trim: true })
  previousSchool: string;

  @Prop({
    required: true,
    enum: Grade,
  })
  applyingGrade: Grade;

  @Prop({
    required: true,
    enum: StudentStatus,
    default: StudentStatus.APPLICATION_CREATED,
  })
  status: StudentStatus;

  @Prop({ type: Number, min: 0, max: 100, default: null })
  examScore: number | null;

  @Prop({ type: String, enum: Course, default: null })
  assignedCourse: Course | null;

  @Prop({ type: Types.ObjectId, ref: 'ExamSlot', default: null })
  slotId: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false })
  feePaid: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
