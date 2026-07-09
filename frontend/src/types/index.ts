export enum UserRole {
  PARENT = "PARENT",
  ADMISSION_TEAM = "ADMISSION_TEAM",
}

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export type SafeUser = Omit<User, "password">;

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum StudentStatus {
  APPLICATION_CREATED = "APPLICATION_CREATED",
  REGISTRATION_FEE_PAID = "REGISTRATION_FEE_PAID",
  SLOT_BOOKED = "SLOT_BOOKED",
  EXAM_COMPLETED = "EXAM_COMPLETED",
  ADMISSION_COMPLETED = "ADMISSION_COMPLETED",
}

export enum Course {
  SCIENCE = "SCIENCE",
  COMMERCE = "COMMERCE",
  ARTS = "ARTS",
}

export interface Student {
  _id: string;
  parentId: string;
  studentName: string;
  dateOfBirth: string;
  gender: Gender;
  previousSchool: string;
  applyingGrade: string;
  status: StudentStatus;
  examScore: number | null;
  assignedCourse: Course | null;
  slotId: ExamSlot | null;
  feePaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExamSlot {
  _id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  isFull: boolean;
  createdAt: string;
}

export type LoginResponse = SafeUser;

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateStudentDto {
  studentName: string;
  dateOfBirth: string;
  gender: Gender;
  previousSchool: string;
  applyingGrade: string;
}

export interface UpdateStudentDto {
  studentName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  previousSchool?: string;
  applyingGrade?: string;
}

export interface CreateExamSlotDto {
  startTime: string;
  endTime: string;
  capacity?: number;
}

export interface BookSlotDto {
  studentId: string;
}

export interface AssignScoreDto {
  examScore: number;
}

export interface AssignCourseDto {
  assignedCourse: Course;
}
