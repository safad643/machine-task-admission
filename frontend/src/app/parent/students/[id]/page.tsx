"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useStudents } from "@/hooks";
import { routes } from "@/lib/routes";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { StudentDetailCard } from "./components/StudentDetailCard";
import { StudentEditForm } from "./components/StudentEditForm";
import { PayRegistrationFeeDialog } from "./components/PayRegistrationFeeDialog";

export default function StudentDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const {
    student,
    isLoading,
    isMutating,
    error,
    fetchStudent,
    payRegistrationFee,
    clearError,
  } = useStudents();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStudent(id);
    }
  }, [id, fetchStudent]);

  const isLocked = student?.feePaid === true;

  function handleEditSuccess() {
    setIsEditing(false);
    void fetchStudent(id);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={routes.parent.students}
          className="text-sm font-medium text-slate underline decoration-slate/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          &larr; Back to students
        </Link>
      </div>

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
          {student && (
            <PayRegistrationFeeDialog
              student={student}
              isMutating={isMutating}
              onPay={payRegistrationFee}
              onPaid={() => void fetchStudent(id)}
            />
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearError();
                void fetchStudent(id);
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {isLoading && (
        <Card className="p-12 text-center">
          <p className="text-slate">Loading student details...</p>
        </Card>
      )}

      {!isLoading && !error && !student && (
        <Card className="p-12 text-center">
          <p className="text-slate">Student not found.</p>
        </Card>
      )}

      {!isLoading && student && !isEditing && (
        <StudentDetailCard student={student} />
      )}

      {!isLoading && student && isEditing && (
        <StudentEditForm
          student={student}
          onSuccess={handleEditSuccess}
          onCancel={handleCancelEdit}
        />
      )}

    </div>
  );
}
