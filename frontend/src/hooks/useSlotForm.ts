"use client";

import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSlotSchema, type ExamSlotFormData } from "@/lib/schemas";
import type { CreateExamSlotDto, ExamSlot } from "@/types";

interface UseSlotFormOptions {
  createSlot: (dto: CreateExamSlotDto) => Promise<ExamSlot>;
  isMutating: boolean;
  error: string | null;
  clearError: () => void;
  onSuccess?: () => void;
}

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

type Field = {
  label: string;
  type: string;
  register: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
  min?: string | number;
  step?: string | number;
  placeholder?: string;
  helperText?: string;
};

const DEFAULT_VALUES: ExamSlotFormData = {
  startTime: "",
  endTime: "",
  capacity: "10",
};

export function useSlotForm({
  createSlot,
  isMutating,
  error,
  clearError,
  onSuccess,
}: UseSlotFormOptions) {
  const form = useForm<ExamSlotFormData>({
    resolver: zodResolver(examSlotSchema),
    defaultValues: DEFAULT_VALUES,
  });

  async function submit(data: ExamSlotFormData) {
    try {
      const startDate = data.startTime.slice(0, 10);
      await createSlot({
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(`${startDate}T${data.endTime}`).toISOString(),
        capacity: Number.parseInt(data.capacity, 10),
      });
      form.reset(DEFAULT_VALUES);
      onSuccess?.();
    } catch {
      // Error is already captured in useExamSlots; swallow to avoid
      // unhandled-rejection warnings from react-hook-form's handleSubmit.
    }
  }

  const { register, formState } = form;
  const errors = formState.errors;
  const minDateTime = toDatetimeLocalValue(new Date());

  const fields: Record<keyof ExamSlotFormData, Field> = {
    startTime: {
      label: "Start Time",
      type: "datetime-local",
      required: true,
      min: minDateTime,
      register: register("startTime"),
      error: errors.startTime?.message,
    },
    endTime: {
      label: "End Time",
      type: "time",
      required: true,
      register: register("endTime"),
      error: errors.endTime?.message,
    },
    capacity: {
      label: "Capacity",
      type: "number",
      required: true,
      min: 1,
      step: 1,
      placeholder: "e.g. 10",
      helperText: "Maximum number of students for this slot.",
      register: register("capacity"),
      error: errors.capacity?.message,
    },
  };

  return {
    fields,
    onSubmit: form.handleSubmit(submit),
    isMutating,
    error,
    clearError,
  };
}
