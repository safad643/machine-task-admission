"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useExamSlots } from "@/hooks";
import { routes } from "@/lib/routes";
import { StudentStatus } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui";
import type { ExamSlot, Student } from "@/types";

interface BookSlotClientProps {
  student: Student;
  slots: ExamSlot[];
  id: string;
}

function formatSlotDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatSlotTime(value: string): string {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BookSlotClient({ student, slots, id }: BookSlotClientProps) {
  const router = useRouter();
  const { bookSlot, isMutating } = useExamSlots();
  const [selectedSlot, setSelectedSlot] = useState<ExamSlot | null>(null);

  useEffect(() => {
    if (
      student.status !== StudentStatus.REGISTRATION_FEE_PAID ||
      student.slotId
    ) {
      router.replace(routes.parent.studentDetail(id));
    }
  }, [student, id, router]);

  async function handleBook() {
    if (!selectedSlot || !id) return;

    try {
      await bookSlot(selectedSlot._id, id);
      router.push(routes.parent.studentDetail(id));
    } catch {
      // Error is already handled by the hook; no additional action needed.
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={routes.parent.studentDetail(id)}
          className="text-sm font-medium text-slate underline decoration-slate/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          &larr; Back to student details
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          Book Exam Slot
        </h1>
        <p className="mt-1 text-base text-slate">
          Choose an available exam slot for this student.
        </p>
      </div>

      {slots.length === 0 && (
        <Card className="p-12 text-center">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            No slots available
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-slate">
            There are currently no exam slots open for booking. Please check back
            later.
          </p>
        </Card>
      )}

      {slots.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => {
            const remaining = slot.capacity - slot.bookedCount;
            const isSelected = selectedSlot?._id === slot._id;
            const isFull = slot.isFull || remaining <= 0;

            return (
              <Card
                key={slot._id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? "border-foreground ring-1 ring-foreground"
                    : "border-border hover:border-foreground/30"
                } ${isFull ? "cursor-not-allowed opacity-60" : ""}`}
                onClick={() => {
                  if (!isFull) {
                    setSelectedSlot(slot);
                  }
                }}
              >
                <CardHeader>
                  <CardTitle className="font-serif text-lg">
                    {formatSlotDate(slot.startTime)}
                  </CardTitle>
                  <CardDescription>
                    {formatSlotTime(slot.startTime)} –{" "}
                    {formatSlotTime(slot.endTime)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="text-slate">
                      Capacity:{" "}
                      <span className="text-foreground">{slot.capacity}</span>
                    </p>
                    <p className="text-slate">
                      Remaining seats:{" "}
                      <span
                        className={`font-medium ${
                          remaining > 5 ? "text-success" : "text-warning"
                        }`}
                      >
                        {remaining}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedSlot && (
        <div className="mt-8 rounded-xl border border-stone bg-background p-6">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Selected Slot
          </h2>
          <p className="mt-1 text-slate">
            {formatSlotDate(selectedSlot.startTime)} from{" "}
            {formatSlotTime(selectedSlot.startTime)} to{" "}
            {formatSlotTime(selectedSlot.endTime)}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Button
              onClick={handleBook}
              isLoading={isMutating}
              disabled={!selectedSlot || isMutating}
            >
              Book Slot
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedSlot(null)}
              disabled={isMutating}
            >
              Clear selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
