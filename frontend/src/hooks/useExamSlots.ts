"use client";

import { useState } from "react";
import { api, type ApiError } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import type { ExamSlot, CreateExamSlotDto } from "@/types";

interface UseExamSlotsReturn {
  isMutating: boolean;
  error: string | null;
  createSlot: (dto: CreateExamSlotDto) => Promise<ExamSlot>;
  bookSlot: (slotId: string, studentId: string) => Promise<void>;
  deleteSlot: (id: string) => Promise<void>;
  clearError: () => void;
}

export function useExamSlots(): UseExamSlotsReturn {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createSlot(dto: CreateExamSlotDto) {
    setIsMutating(true);
    setError(null);

    try {
      const { data } = await api.post<ExamSlot>(endpoints.examSlots.list, dto);
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsMutating(false);
    }
  }

  async function bookSlot(slotId: string, studentId: string) {
    setIsMutating(true);
    setError(null);

    try {
      await api.post(endpoints.examSlots.book(slotId), { studentId });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsMutating(false);
    }
  }

  async function deleteSlot(id: string) {
    setIsMutating(true);
    setError(null);

    try {
      await api.delete(endpoints.examSlots.detail(id));
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
    createSlot,
    bookSlot,
    deleteSlot,
    clearError: () => setError(null),
  };
}
