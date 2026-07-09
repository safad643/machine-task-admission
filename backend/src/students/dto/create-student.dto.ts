import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from '../students.schema.js';

export class CreateStudentDto {
  @IsNotEmpty({ message: 'Student name is required' })
  @IsString({ message: 'Student name must be a string' })
  studentName: string;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateString(
    {},
    { message: 'Date of birth must be a valid ISO date string' },
  )
  dateOfBirth: string;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(Gender, { message: 'Gender must be MALE, FEMALE, or OTHER' })
  gender: Gender;

  @IsNotEmpty({ message: 'Previous school is required' })
  @IsString({ message: 'Previous school must be a string' })
  previousSchool: string;

  @IsNotEmpty({ message: 'Applying grade is required' })
  @IsString({ message: 'Applying grade must be a string' })
  applyingGrade: string;
}
