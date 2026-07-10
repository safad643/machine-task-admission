"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStudents } from "./useStudents";
import { routes } from "@/lib/routes";
import {
  createStudentSchema,
  type CreateStudentFormData,
} from "@/lib/schemas";
import { Gender, Grade } from "@/types";

export function useStudentForm() {
  const router = useRouter();
  const { createStudent, isMutating, error, clearError } = useStudents();

  const form = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      studentName: "",
      dateOfBirth: "",
      gender: Gender.MALE,
      previousSchool: "",
      applyingGrade: "" as unknown as Grade,
    },
  });

  async function submit(data: CreateStudentFormData) {
    try {
      await createStudent(data);
      router.push(routes.parent.students);
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
