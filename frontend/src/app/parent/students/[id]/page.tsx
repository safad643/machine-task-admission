"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useStudents } from "@/hooks/useStudents";
import { routes } from "@/lib/routes";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StudentDetailCard } from "./components/StudentDetailCard";

export default function StudentDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { student, isLoading, error, fetchStudent, clearError } = useStudents();

  useEffect(() => {
    if (id) {
      fetchStudent(id);
    }
  }, [id, fetchStudent]);

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
        <Link
          href={`${routes.parent.studentDetail(id)}/edit`}
          className="inline-flex h-10 items-center justify-center rounded-md border border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Edit
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-danger/20 bg-danger/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-danger-text">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearError();
                fetchStudent(id);
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

      {!isLoading && student && <StudentDetailCard student={student} />}
    </div>
  );
}
