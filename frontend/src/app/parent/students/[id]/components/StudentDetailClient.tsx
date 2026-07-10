"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStudents } from "@/hooks";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { Student, StudentStatus } from "@/types";
import { StudentDetailCard } from "./StudentDetailCard";
import { StudentEditForm } from "./StudentEditForm";
import { PayRegistrationFeeDialog } from "./PayRegistrationFeeDialog";

interface StudentDetailClientProps {
  student: Student;
  id: string;
}

export function StudentDetailClient({ student, id }: StudentDetailClientProps) {
  const router = useRouter();
  const { isMutating, error, payRegistrationFee, clearError } = useStudents();
  const [isEditing, setIsEditing] = useState(false);

  const isLocked = student.feePaid === true;

  function handleEditSuccess() {
    setIsEditing(false);
    router.refresh();
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  function handleTryAgain() {
    clearError();
    router.refresh();
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Student Details
          </h1>
          <p className="mt-1 text-base text-slate">
            View and manage this application.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} disabled={isLocked}>
              {isLocked ? "Locked" : "Edit"}
            </Button>
          )}
          {!isEditing && (
            <PayRegistrationFeeDialog
              student={student}
              isMutating={isMutating}
              onPay={payRegistrationFee}
              onPaid={() => router.refresh()}
            />
          )}
          {student.status === StudentStatus.REGISTRATION_FEE_PAID &&
            !student.slotId && (
              <Button asChild>
                <Link href={routes.parent.bookSlot(id)}>Book Exam Slot</Link>
              </Button>
            )}
        </div>
      </div>

      {isLocked && (
        <Card className="mb-6 border-warning/20 bg-warning/10 p-4">
          <p className="text-sm font-medium text-warning">
            Student details are locked after registration fee is paid.
          </p>
        </Card>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-danger/20 bg-danger/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-danger-text">{error}</p>
            <Button variant="outline" size="sm" onClick={handleTryAgain}>
              Try again
            </Button>
          </div>
        </div>
      )}

      {!isEditing && <StudentDetailCard student={student} />}

      {isEditing && (
        <StudentEditForm
          student={student}
          onSuccess={handleEditSuccess}
          onCancel={handleCancelEdit}
        />
      )}
    </>
  );
}
