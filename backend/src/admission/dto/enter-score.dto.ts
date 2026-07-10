import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class EnterScoreDto {
  @IsNotEmpty({ message: 'Exam score is required' })
  @IsInt({ message: 'Exam score must be a whole number' })
  @Min(0, { message: 'Exam score must be at least 0' })
  @Max(100, { message: 'Exam score must be at most 100' })
  examScore: number;
}
