import { Grade, Gender, Course } from "@/types";

type ClassValue = string | number | boolean | undefined | null | ClassValue[] | { [key: string]: boolean | undefined | null };

export function formatGradeLabel(grade: Grade): string {
  return grade.replace("GRADE_", "Grade ");
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

export const courseLabelMap: Record<Course, string> = {
  [Course.SCIENCE]: "Science",
  [Course.COMMERCE]: "Commerce",
  [Course.ARTS]: "Arts",
};

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input && input !== 0) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
      continue;
    }

    if (Array.isArray(input)) {
      const flattened = cn(...input);
      if (flattened) classes.push(flattened);
      continue;
    }

    if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}
