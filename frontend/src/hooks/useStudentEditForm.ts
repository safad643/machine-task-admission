"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStudents } from "./useStudents";
import {
  updateStudentSchema,
  type UpdateStudentFormData,
} from "@/lib/schemas";
import { Gender, Grade } from "@/types";

interface UseStudentEditFormOptions {
  studentId: string;
  initialData: UpdateStudentFormData;
  onSuccess?: () => void;
}

export function useStudentEditForm({
  studentId,
  initialData,
  onSuccess,
}: UseStudentEditFormOptions) {
  const { updateStudent, isMutating, error, clearError } = useStudents();

  const form = useForm<UpdateStudentFormData>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    form.reset(initialData);
  }, [form, initialData]);

  async function submit(data: UpdateStudentFormData) {
    try {
      await updateStudent(studentId, data);
      onSuccess?.();
    } catch {
      // Error is already captured in useStudents; swallow to avoid
      // unhandled-rejection warnings from react-hook-form's handleSubmit.
    }
  }

  return {
    form,
    submit: form.handleSubmit(submit),
    isMutating,
    error,
    clearError,
  };
}

export function mapStudentToFormData(student: {
  studentName: string;
  dateOfBirth: string;
  gender: Gender;
  previousSchool: string;
  applyingGrade: Grade;
}): UpdateStudentFormData {
  return {
    studentName: student.studentName,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    previousSchool: student.previousSchool,
    applyingGrade: student.applyingGrade,
  };
}
