import { IsEnum, IsNotEmpty } from 'class-validator';
import { Course } from '../../students/students.schema.js';

export class AssignCourseDto {
  @IsEnum(Course)
  @IsNotEmpty()
  course: Course;
}
