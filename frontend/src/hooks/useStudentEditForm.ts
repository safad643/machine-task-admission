"use client";

import { useEffect } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
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

type Field = {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

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

  const { register, formState } = form;
  const errors = formState.errors;

  const fields: Record<keyof UpdateStudentFormData, Field> = {
    studentName: {
      label: "Student Name",
      placeholder: "e.g. Jane Doe",
      required: true,
      register: register("studentName"),
      error: errors.studentName?.message,
    },
    dateOfBirth: {
      label: "Date of Birth",
      type: "date",
      required: true,
      register: register("dateOfBirth"),
      error: errors.dateOfBirth?.message,
    },
    gender: {
      label: "Gender",
      required: true,
      register: register("gender"),
      error: errors.gender?.message,
    },
    previousSchool: {
      label: "Previous School",
      placeholder: "e.g. Springdale Elementary",
      required: true,
      register: register("previousSchool"),
      error: errors.previousSchool?.message,
    },
    applyingGrade: {
      label: "Applying Grade",
      required: true,
      register: register("applyingGrade"),
      error: errors.applyingGrade?.message,
    },
  };

  return {
    fields,
    onSubmit: form.handleSubmit(submit),
    onReset: () => form.reset(initialData),
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
