import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class EnterScoreDto {
  @IsInt()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  score: number;
}
