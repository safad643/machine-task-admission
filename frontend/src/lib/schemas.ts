import { z } from "zod";
import { Gender, Course } from "@/types";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be under 128 characters"),
});

export const createStudentSchema = z.object({
  studentName: z
    .string()
    .min(1, "Student name is required")
    .max(100, "Student name must be under 100 characters"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be a valid date")
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Date of birth must be a valid date",
    }),
  gender: z.nativeEnum(Gender),
  previousSchool: z.string().min(1, "Previous school is required"),
  applyingGrade: z.string().min(1, "Applying grade is required"),
});

export const updateStudentSchema = createStudentSchema.partial();

export const scoreSchema = z.object({
  examScore: z
    .number()
    .refine((value) => !Number.isNaN(value), {
      message: "Exam score is required",
    })
    .refine((value) => value >= 0, {
      message: "Score must be at least 0",
    })
    .refine((value) => value <= 100, {
      message: "Score must be at most 100",
    }),
});

export const courseSchema = z.object({
  assignedCourse: z.nativeEnum(Course, {
    message: "Please select a course",
  }),
});

export const examSlotSchema = z
  .object({
    startTime: z
      .string()
      .min(1, "Start time is required")
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
        "Start time must be a valid date and time"
      )
      .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: "Start time must be a valid date and time",
      })
      .refine((value) => new Date(value) > new Date(), {
        message: "Start time must be in the future",
      }),
    endTime: z
      .string()
      .min(1, "End time is required")
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
        "End time must be a valid date and time"
      )
      .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: "End time must be a valid date and time",
      }),
    capacity: z
      .string()
      .min(1, "Capacity is required")
      .regex(/^[1-9]\d*$/, "Capacity must be a positive whole number"),
  })
  .refine(
    (data) =>
      Number.isNaN(new Date(data.startTime).getTime()) ||
      Number.isNaN(new Date(data.endTime).getTime()) ||
      new Date(data.endTime).getTime() > new Date(data.startTime).getTime(),
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateStudentFormData = z.infer<typeof createStudentSchema>;
export type UpdateStudentFormData = z.infer<typeof updateStudentSchema>;
export type ScoreFormData = z.infer<typeof scoreSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type ExamSlotFormData = z.infer<typeof examSlotSchema>;
