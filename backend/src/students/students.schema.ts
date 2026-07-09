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

  @Prop({ required: true, trim: true })
  applyingGrade: string;

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
