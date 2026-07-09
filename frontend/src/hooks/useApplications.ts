"use client";

import { useState, useCallback } from "react";
import { api, type ApiError } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import type { Student, StudentStatus, Course } from "@/types";

interface UseApplicationsReturn {
  applications: Student[] | null;
  application: Student | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  fetchApplications: (status?: StudentStatus) => Promise<void>;
  fetchApplication: (id: string) => Promise<void>;
  assignScore: (id: string, examScore: number) => Promise<Student>;
  assignCourse: (id: string, assignedCourse: Course) => Promise<Student>;
  clearError: () => void;
}

export function useApplications(): UseApplicationsReturn {
  const [applications, setApplications] = useState<Student[] | null>(null);
  const [application, setApplication] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async (status?: StudentStatus) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = status
        ? `${endpoints.admission.applications}?status=${encodeURIComponent(status)}`
        : endpoints.admission.applications;
      const { data } = await api.get<Student[]>(url);
      setApplications(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchApplication = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<Student>(endpoints.admission.applicationDetail(id));
      setApplication(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function assignScore(id: string, examScore: number) {
    setIsMutating(true);
    setError(null);

    try {
      const { data } = await api.patch<Student>(
        endpoints.admission.score(id),
        { examScore }
      );
      setApplication(data);
      setApplications((prev) =>
        prev ? prev.map((app) => (app._id === id ? data : app)) : prev
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
      setApplication(data);
      setApplications((prev) =>
        prev ? prev.map((app) => (app._id === id ? data : app)) : prev
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
    applications,
    application,
    isLoading,
    isMutating,
    error,
    fetchApplications,
    fetchApplication,
    assignScore,
    assignCourse,
    clearError: () => setError(null),
  };
}
