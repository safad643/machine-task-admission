import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IsFutureDate } from '../../common/decorators/is-future-date.decorator.js';

@ValidatorConstraint({ name: 'isEndAfterStart', async: false })
class IsEndAfterStartConstraint implements ValidatorConstraintInterface {
  validate(endTime: string, args: ValidationArguments) {
    const startTime = (args.object as CreateExamSlotDto).startTime;
    if (!startTime || !endTime) return true;
    return new Date(endTime).getTime() > new Date(startTime).getTime();
  }

  defaultMessage() {
    return 'End time must be after start time';
  }
}

export class CreateExamSlotDto {
  @IsNotEmpty({ message: 'Start time is required' })
  @IsDateString({}, { message: 'Start time must be a valid ISO date string' })
  @IsFutureDate({ message: 'Start time must be in the future' })
  startTime: string;

  @IsNotEmpty({ message: 'End time is required' })
  @IsDateString({}, { message: 'End time must be a valid ISO date string' })
  @Validate(IsEndAfterStartConstraint)
  endTime: string;

  @IsNotEmpty({ message: 'Capacity is required' })
  @IsInt({ message: 'Capacity must be an integer' })
  @Min(1, { message: 'Capacity must be at least 1' })
  capacity: number;
}
