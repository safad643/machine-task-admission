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

export function CreateSlotForm() {
  const router = useRouter();
  const { createSlot, isMutating, error, clearError } = useExamSlots();

  const { fields, onSubmit, isMutating: isCreating, error: formError } =
    useSlotForm({
      createSlot,
      isMutating,
      error,
      clearError,
      onSuccess: () => {
        router.refresh();
      },
    });

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
        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          <Input
            label={fields.startTime.label}
            type={fields.startTime.type}
            required={fields.startTime.required}
            min={fields.startTime.min}
            error={fields.startTime.error}
            {...fields.startTime.register}
          />
          <Input
            label={fields.endTime.label}
            type={fields.endTime.type}
            required={fields.endTime.required}
            min={fields.endTime.min}
            error={fields.endTime.error}
            {...fields.endTime.register}
          />
          <Input
            label={fields.capacity.label}
            type={fields.capacity.type}
            min={fields.capacity.min}
            step={fields.capacity.step}
            placeholder={fields.capacity.placeholder}
            helperText={fields.capacity.helperText}
            required={fields.capacity.required}
            error={fields.capacity.error}
            {...fields.capacity.register}
          />
          <Button type="submit" isLoading={isCreating} fullWidth>
            Create Slot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
