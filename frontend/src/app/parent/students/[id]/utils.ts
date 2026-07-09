import { StudentStatus, Gender, Course } from "@/types";
import type { BadgeProps } from "@/components/ui/Badge";

export const statusVariantMap: Record<StudentStatus, BadgeProps["variant"]> = {
  [StudentStatus.APPLICATION_CREATED]: "warning",
  [StudentStatus.REGISTRATION_FEE_PAID]: "secondary",
  [StudentStatus.SLOT_BOOKED]: "default",
  [StudentStatus.EXAM_COMPLETED]: "outline",
  [StudentStatus.ADMISSION_COMPLETED]: "success",
};

export function formatStatusLabel(status: StudentStatus): string {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatGenderLabel(gender: Gender): string {
  return gender
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatCourseLabel(course: Course | null): string {
  if (!course) return "Not assigned";
  return course
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
