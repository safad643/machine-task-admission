import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from '../students.schema.js';

export class UpdateStudentDto {
  @IsOptional()
  @IsString({ message: 'Student name must be a string' })
  studentName?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Date of birth must be a valid ISO date string' },
  )
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be MALE, FEMALE, or OTHER' })
  gender?: Gender;

  @IsOptional()
  @IsString({ message: 'Previous school must be a string' })
  previousSchool?: string;

  @IsOptional()
  @IsString({ message: 'Applying grade must be a string' })
  applyingGrade?: string;
}
