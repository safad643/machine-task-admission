import { IsMongoId, IsNotEmpty } from 'class-validator';

export class BookExamSlotDto {
  @IsNotEmpty({ message: 'Student ID is required' })
  @IsMongoId({ message: 'Student ID must be a valid MongoDB ID' })
  studentId: string;
}
