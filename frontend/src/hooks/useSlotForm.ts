"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSlotSchema, type ExamSlotFormData } from "@/lib/schemas";
import type { CreateExamSlotDto, ExamSlot } from "@/types";

interface UseSlotFormOptions {
  createSlot: (dto: CreateExamSlotDto) => Promise<ExamSlot>;
  isMutating: boolean;
  error: string | null;
  clearError: () => void;
}

export function useSlotForm({
  createSlot,
  isMutating,
  error,
  clearError,
}: UseSlotFormOptions) {
  const form = useForm<ExamSlotFormData>({
    resolver: zodResolver(examSlotSchema),
    defaultValues: {
      startTime: "",
      endTime: "",
      capacity: "10",
    },
  });

  async function submit(data: ExamSlotFormData) {
    try {
      await createSlot({
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        capacity: Number.parseInt(data.capacity, 10),
      });
      form.reset({
        startTime: "",
        endTime: "",
        capacity: "10",
      });
    } catch {
      // Error is already captured in useExamSlots; swallow to avoid
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
