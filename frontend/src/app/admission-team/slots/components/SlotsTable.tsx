"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useExamSlots } from "@/hooks";
import { Alert, Button, Badge, Confirmation } from "@/components/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import type { ExamSlot } from "@/types";
import { formatSlotDate, formatSlotTime } from "@/lib/date-utils";

interface SlotsTableProps {
  slots: ExamSlot[];
}

export function SlotsTable({ slots }: SlotsTableProps) {
  const router = useRouter();
  const { deleteSlot, isMutating, error, clearError } = useExamSlots();
  const [slotToDelete, setSlotToDelete] = useState<ExamSlot | null>(null);

  async function handleDelete(slot: ExamSlot) {
    try {
      await deleteSlot(slot._id);
      router.refresh();
      setSlotToDelete(null);
    } catch {
      // Error is handled by the hook.
    }
  }

  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">All Slots</CardTitle>
          <CardDescription>
            Slots are shown with booking status. Slots with bookings cannot be
            deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert message={error} onDismiss={clearError} dismissLabel="Clear" className="mb-4" />

          {slots.length === 0 && (
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

          {slots.length > 0 && (
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
  );
}
