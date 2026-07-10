"use client";

import { useState } from "react";
import { api, type ApiError } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import type { Student, CreateStudentDto, UpdateStudentDto } from "@/types";

interface UseStudentsReturn {
  isMutating: boolean;
  error: string | null;
  createStudent: (dto: CreateStudentDto) => Promise<Student>;
  updateStudent: (id: string, dto: UpdateStudentDto) => Promise<Student>;
  payRegistrationFee: (id: string) => Promise<Student>;
  clearError: () => void;
}

export function useStudents(): UseStudentsReturn {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createStudent(dto: CreateStudentDto) {
    setIsMutating(true);
    setError(null);

    try {
      const { data } = await api.post<Student>(endpoints.students.list, dto);
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsMutating(false);
    }
  }

  async function updateStudent(id: string, dto: UpdateStudentDto) {
    setIsMutating(true);
    setError(null);

    try {
      const { data } = await api.patch<Student>(endpoints.students.detail(id), dto);
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsMutating(false);
    }
  }

  async function payRegistrationFee(id: string) {
    setIsMutating(true);
    setError(null);

    try {
      const { data } = await api.post<Student>(endpoints.students.registrationFee(id));
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsMutating(false);
    }
  }

  return {
    isMutating,
    error,
    createStudent,
    updateStudent,
    payRegistrationFee,
    clearError: () => setError(null),
  };
}
