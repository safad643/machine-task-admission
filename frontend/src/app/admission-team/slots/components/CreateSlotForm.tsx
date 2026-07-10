"use client";

import { useRouter } from "next/navigation";
import { useExamSlots, useSlotForm } from "@/hooks";
import { Button, Input } from "@/components/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const DEFAULT_VALUES = {
  startTime: "",
  endTime: "",
  capacity: "10",
};

export function CreateSlotForm() {
  const router = useRouter();
  const { createSlot, isMutating, error, clearError } = useExamSlots();

  const slotForm = useSlotForm({
    createSlot,
    isMutating,
    error,
    clearError,
    onSuccess: () => {
      slotForm.form.reset(DEFAULT_VALUES);
      router.refresh();
    },
  });

  const { form, submit, isMutating: isCreating, error: formError } = slotForm;

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Create Slot</CardTitle>
        <CardDescription>
          Add a new exam slot for parents to book.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formError && (
          <div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-danger-text">{formError}</p>
              <Button variant="outline" size="sm" onClick={() => clearError()}>
                Clear
              </Button>
            </div>
          </div>
        )}
        <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
          <Input
            label="Start Time"
            type="datetime-local"
            required
            min={toDatetimeLocalValue(new Date())}
            {...form.register("startTime")}
            error={form.formState.errors.startTime?.message}
          />
          <Input
            label="End Time"
            type="datetime-local"
            required
            min={toDatetimeLocalValue(new Date())}
            {...form.register("endTime")}
            error={form.formState.errors.endTime?.message}
          />
          <Input
            label="Capacity"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 10"
            helperText="Maximum number of students for this slot."
            required
            {...form.register("capacity")}
            error={form.formState.errors.capacity?.message}
          />
          <Button type="submit" isLoading={isCreating} fullWidth>
            Create Slot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
