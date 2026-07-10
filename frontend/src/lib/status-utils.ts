import { StudentStatus } from "@/types";
import type { BadgeProps } from "@/components/ui/Badge";

export const statusVariantMap: Record<StudentStatus, BadgeProps["variant"]> = {
  [StudentStatus.APPLICATION_CREATED]: "warning",
  [StudentStatus.REGISTRATION_FEE_PAID]: "secondary",
  [StudentStatus.SLOT_BOOKED]: "default",
  [StudentStatus.EXAM_COMPLETED]: "outline",
  [StudentStatus.ADMISSION_COMPLETED]: "success",
};

export const statusLabelMap: Record<StudentStatus, string> = {
  [StudentStatus.APPLICATION_CREATED]: "Application Created",
  [StudentStatus.REGISTRATION_FEE_PAID]: "Registration Fee Paid",
  [StudentStatus.SLOT_BOOKED]: "Slot Booked",
  [StudentStatus.EXAM_COMPLETED]: "Exam Completed",
  [StudentStatus.ADMISSION_COMPLETED]: "Admission Completed",
};

export const statusOrder: StudentStatus[] = [
  StudentStatus.APPLICATION_CREATED,
  StudentStatus.REGISTRATION_FEE_PAID,
  StudentStatus.SLOT_BOOKED,
  StudentStatus.EXAM_COMPLETED,
  StudentStatus.ADMISSION_COMPLETED,
];

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getStatusCounts<T extends { status: StudentStatus }>(
  items: T[]
): Record<StudentStatus, number> {
  const counts = Object.fromEntries(
    statusOrder.map((status) => [status, 0])
  ) as Record<StudentStatus, number>;

  for (const item of items) {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
  }

  return counts;
}
