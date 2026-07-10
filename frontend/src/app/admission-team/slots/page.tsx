"use client";

import { useEffect, useState } from "react";
import { useExamSlots, useSlotForm } from "@/hooks";
import { Button, Input, Badge, Confirmation, Loading } from "@/components/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import type { ExamSlot } from "@/types";

function formatSlotDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatSlotTime(value: string): string {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
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

export default function ExamSlotsPage() {
  const {
    slots,
    isLoading,
    isMutating,
    error,
    fetchAllSlots,
    createSlot,
    deleteSlot,
    clearError,
  } = useExamSlots();

  const {
    form,
    submit,
    isMutating: isCreating,
    error: formError,
  } = useSlotForm({
    createSlot,
    isMutating,
    error,
    clearError,
  });

  const [slotToDelete, setSlotToDelete] = useState<ExamSlot | null>(null);

  useEffect(() => {
    void fetchAllSlots();
  }, [fetchAllSlots]);

  const displayError = error ?? formError;

  async function handleDelete(slot: ExamSlot) {
    try {
      await deleteSlot(slot._id);
      setSlotToDelete(null);
    } catch {
      // Error is handled by the hook.
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          Exam Slot Management
        </h1>
        <p className="mt-1 text-base text-slate">
          Create and manage exam slots for admission applicants.
        </p>
      </div>

      {displayError && (
        <div className="mb-6 rounded-xl border border-danger/20 bg-danger/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-danger-text">{displayError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearError();
                void fetchAllSlots();
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Create Slot</CardTitle>
            <CardDescription>
              Add a new exam slot for parents to book.
            </CardDescription>
          </CardHeader>
          <CardContent>
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

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">All Slots</CardTitle>
              <CardDescription>
                Slots are shown with booking status. Slots with bookings cannot
                be deleted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <Loading message="Loading slots..." className="min-h-0 py-12" />
              )}

              {!isLoading && slots !== null && slots.length === 0 && (
                <div className="py-12 text-center">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    No exam slots yet
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-slate">
                    Create a slot using the form. Slots will appear here and be
                    available for parents to book.
                  </p>
                </div>
              )}

              {!isLoading && slots !== null && slots.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="border-b border-stone bg-muted">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Start
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          End
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Capacity
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Booked
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map((slot) => {
                        const remaining = slot.capacity - slot.bookedCount;
                        const hasBookings = slot.bookedCount > 0;

                        return (
                          <tr
                            key={slot._id}
                            className="border-b border-stone last:border-b-0 hover:bg-paper/50"
                          >
                            <td className="px-4 py-3 text-sm text-foreground">
                              {formatSlotDate(slot.startTime)}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate">
                              {formatSlotTime(slot.startTime)}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate">
                              {formatSlotTime(slot.endTime)}
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground">
                              {slot.capacity}
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground">
                              {slot.bookedCount}
                              {remaining > 0 && (
                                <span className="ml-1 text-slate">
                                  ({remaining} left)
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {slot.isFull || remaining <= 0 ? (
                                <Badge variant="danger" size="sm">
                                  Full
                                </Badge>
                              ) : remaining <= 3 ? (
                                <Badge variant="warning" size="sm">
                                  Filling
                                </Badge>
                              ) : (
                                <Badge variant="success" size="sm">
                                  Available
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {slotToDelete?._id === slot._id ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSlotToDelete(null)}
                                  disabled={isMutating}
                                >
                                  Cancel
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="danger"
                                  size="sm"
                                  onClick={() => setSlotToDelete(slot)}
                                  disabled={hasBookings}
                                  title={
                                    hasBookings
                                      ? "Cannot delete a slot that has bookings"
                                      : "Delete slot"
                                  }
                                >
                                  Delete
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {slotToDelete && (
            <div className="mt-6">
              <Confirmation
                title="Delete Exam Slot"
                description={`Are you sure you want to delete the slot on ${formatSlotDate(
                  slotToDelete.startTime
                )} at ${formatSlotTime(
                  slotToDelete.startTime
                )}? This action cannot be undone.`}
                confirmLabel="Delete Slot"
                cancelLabel="Cancel"
                variant="danger"
                isLoading={isMutating}
                onConfirm={() => handleDelete(slotToDelete)}
                onCancel={() => setSlotToDelete(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
