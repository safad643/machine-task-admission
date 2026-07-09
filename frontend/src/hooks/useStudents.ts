"use client";

import { useState, useCallback } from "react";
import { api, type ApiError } from "@/lib/api";
import type { Student, CreateStudentDto, UpdateStudentDto } from "@/types";

interface UseStudentsReturn {
  students: Student[] | null;
  student: Student | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  fetchStudent: (id: string) => Promise<void>;
  createStudent: (dto: CreateStudentDto) => Promise<Student>;
  updateStudent: (id: string, dto: UpdateStudentDto) => Promise<Student>;
  payRegistrationFee: (id: string) => Promise<Student>;
  clearError: () => void;
}

export function useStudents(): UseStudentsReturn {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<Student[]>("/students");
      setStudents(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStudent = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<Student>(`/students/${id}`);
      setStudent(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function createStudent(dto: CreateStudentDto) {
    setIsMutating(true);
    setError(null);

    try {
      const { data } = await api.post<Student>("/students", dto);
      setStudents((prev) => (prev ? [data, ...prev] : [data]));
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
      const { data } = await api.patch<Student>(`/students/${id}`, dto);
      setStudent(data);
      setStudents((prev) =>
        prev ? prev.map((s) => (s._id === id ? data : s)) : prev
      );
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
      const { data } = await api.post<Student>(`/students/${id}/registration-fee`);
      setStudent(data);
      setStudents((prev) =>
        prev ? prev.map((s) => (s._id === id ? data : s)) : prev
      );
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
    students,
    student,
    isLoading,
    isMutating,
    error,
    fetchStudents,
    fetchStudent,
    createStudent,
    updateStudent,
    payRegistrationFee,
    clearError: () => setError(null),
  };
}
