"use client";

import { useState } from "react";
import { api, type ApiError } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import type { Student, Course } from "@/types";

interface UseApplicationsReturn {
  isMutating: boolean;
  error: string | null;
  assignScore: (id: string, examScore: number) => Promise<Student>;
  assignCourse: (id: string, assignedCourse: Course) => Promise<Student>;
  clearError: () => void;
}

export function useApplications(): UseApplicationsReturn {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function assignScore(id: string, examScore: number) {
    setIsMutating(true);
    setError(null);

    try {
      const { data } = await api.patch<Student>(
        endpoints.admission.score(id),
        { examScore }
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

  async function assignCourse(id: string, assignedCourse: Course) {
    setIsMutating(true);
    setError(null);

    try {
      const { data } = await api.patch<Student>(
        endpoints.admission.assignCourse(id),
        { assignedCourse }
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
    isMutating,
    error,
    assignScore,
    assignCourse,
    clearError: () => setError(null),
  };
}
