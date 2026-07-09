import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateExamSlotDto {
  @IsNotEmpty({ message: 'Start time is required' })
  @IsDateString({}, { message: 'Start time must be a valid ISO date string' })
  startTime: string;

  @IsNotEmpty({ message: 'Capacity is required' })
  @IsInt({ message: 'Capacity must be an integer' })
  @Min(1, { message: 'Capacity must be at least 1' })
  capacity: number;
}
