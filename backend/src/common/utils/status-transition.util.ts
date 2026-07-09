import { ConflictException } from '@nestjs/common';
import { StudentStatus } from '../../students/students.schema.js';

const allowedTransitions: Record<StudentStatus, StudentStatus[]> = {
  [StudentStatus.APPLICATION_CREATED]: [StudentStatus.REGISTRATION_FEE_PAID],
  [StudentStatus.REGISTRATION_FEE_PAID]: [StudentStatus.SLOT_BOOKED],
  [StudentStatus.SLOT_BOOKED]: [StudentStatus.EXAM_COMPLETED],
  [StudentStatus.EXAM_COMPLETED]: [StudentStatus.ADMISSION_COMPLETED],
  [StudentStatus.ADMISSION_COMPLETED]: [],
};

export function canTransition(from: StudentStatus, to: StudentStatus): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export function assertCanTransition(
  from: StudentStatus,
  to: StudentStatus,
): void {
  if (!canTransition(from, to)) {
    throw new ConflictException(
      `Invalid status transition from ${from} to ${to}`,
    );
  }
}
