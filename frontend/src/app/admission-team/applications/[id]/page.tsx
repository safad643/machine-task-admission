"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApplications } from "@/hooks/useApplications";
import { routes } from "@/lib/routes";
import { Button, Loading } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { StudentStatus } from "@/types";
import { StudentDetailCard } from "@/app/parent/students/[id]/components/StudentDetailCard";

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { application, isLoading, error, fetchApplication, clearError } =
    useApplications();

  useEffect(() => {
    if (id) {
      void fetchApplication(id);
    }
  }, [id, fetchApplication]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={routes.admissionTeam.applications}
          className="text-sm font-medium text-slate underline decoration-slate/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          &larr; Back to applications
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Application Details
          </h1>
          <p className="mt-1 text-base text-slate">
            Review the full student information and current status.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {application?.status === StudentStatus.SLOT_BOOKED && (
            <Link href={routes.admissionTeam.applicationScore(id)}>
              <Button>Enter Exam Score</Button>
            </Link>
          )}
          {application?.status === StudentStatus.EXAM_COMPLETED && (
            <Link href={routes.admissionTeam.applicationAssign(id)}>
              <Button>Assign Course</Button>
            </Link>
          )}
        </div>
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
                void fetchApplication(id);
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {isLoading && (
        <Card className="p-12 text-center">
          <Loading message="Loading application details..." className="min-h-0" />
        </Card>
      )}

      {!isLoading && !error && !application && (
        <Card className="p-12 text-center">
          <p className="text-slate">Application not found.</p>
        </Card>
      )}

      {!isLoading && application && <StudentDetailCard student={application} />}
    </div>
  );
}
