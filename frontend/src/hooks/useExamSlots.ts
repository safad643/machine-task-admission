"use client";

import { useState, useCallback } from "react";
import { api, type ApiError } from "@/lib/api";
import type { ExamSlot, CreateExamSlotDto } from "@/types";

interface UseExamSlotsReturn {
  slots: ExamSlot[] | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  fetchAvailableSlots: () => Promise<void>;
  fetchAllSlots: () => Promise<void>;
  createSlot: (dto: CreateExamSlotDto) => Promise<ExamSlot>;
  bookSlot: (slotId: string, studentId: string) => Promise<void>;
  deleteSlot: (id: string) => Promise<void>;
  clearError: () => void;
}

export function useExamSlots(): UseExamSlotsReturn {
  const [slots, setSlots] = useState<ExamSlot[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableSlots = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<ExamSlot[]>("/exam-slots");
      setSlots(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllSlots = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<ExamSlot[]>("/exam-slots/all");
      setSlots(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function createSlot(dto: CreateExamSlotDto) {
    setIsMutating(true);
    setError(null);

    try {
      const { data } = await api.post<ExamSlot>("/exam-slots", dto);
      setSlots((prev) => (prev ? [...prev, data] : [data]));
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
      await api.post(`/exam-slots/${slotId}/book`, { studentId });
      setSlots((prev) =>
        prev
          ? prev.map((slot) =>
              slot._id === slotId
                ? { ...slot, bookedCount: slot.bookedCount + 1 }
                : slot
            )
          : prev
      );
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
      await api.delete(`/exam-slots/${id}`);
      setSlots((prev) => (prev ? prev.filter((slot) => slot._id !== id) : prev));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsMutating(false);
    }
  }

  return {
    slots,
    isLoading,
    isMutating,
    error,
    fetchAvailableSlots,
    fetchAllSlots,
    createSlot,
    bookSlot,
    deleteSlot,
    clearError: () => setError(null),
  };
}
