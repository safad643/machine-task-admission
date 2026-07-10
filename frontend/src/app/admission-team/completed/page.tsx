"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useApplications } from "@/hooks/useApplications";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { Loading } from "@/components/ui/Loading";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StudentStatus, Course } from "@/types";
import type { Student } from "@/types";
import { formatGradeLabel } from "@/lib/utils";

const courseLabelMap: Record<Course, string> = {
  [Course.SCIENCE]: "Science",
  [Course.COMMERCE]: "Commerce",
  [Course.ARTS]: "Arts",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getCompletedApplications(
  applications: Student[] | null
): Student[] | null {
  if (!applications) return null;
  return applications
    .filter((app) => app.status === StudentStatus.ADMISSION_COMPLETED)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export default function CompletedAdmissionsPage() {
  const {
    applications,
    isLoading,
    error,
    fetchApplications,
    clearError,
  } = useApplications();

  useEffect(() => {
    fetchApplications(StudentStatus.ADMISSION_COMPLETED);
  }, [fetchApplications]);

  const completedApplications = getCompletedApplications(applications);
  const completedCount = completedApplications?.length ?? 0;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Completed Admissions
          </h1>
          <p className="mt-1 text-base text-slate">
            View all finalized admissions with scores and assigned courses.
          </p>
        </div>
        <Link
          href={routes.admissionTeam.applications}
          className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Back to Applications
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
                fetchApplications(StudentStatus.ADMISSION_COMPLETED);
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {isLoading && <Loading message="Loading completed admissions..." />}

      {!isLoading && completedApplications !== null && completedCount === 0 && (
        <div className="rounded-2xl border border-stone bg-background p-12 text-center shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)]">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            No completed admissions yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-slate">
            Completed admissions will appear here once the admission team
            assigns courses to students who have finished their exams.
          </p>
          <div className="mt-6">
            <Link
              href={routes.admissionTeam.applications}
              className="text-sm font-medium text-seal underline decoration-seal/30 underline-offset-4 transition-colors hover:text-seal-light hover:decoration-seal"
            >
              Go to applications &rarr;
            </Link>
          </div>
        </div>
      )}

      {!isLoading && completedApplications !== null && completedCount > 0 && (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-normal text-slate">
                  Completed Admissions
                </CardTitle>
                <p className="font-serif text-3xl font-semibold text-foreground">
                  {completedCount}
                </p>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-normal text-slate">
                  Science
                </CardTitle>
                <p className="font-serif text-3xl font-semibold text-foreground">
                  {
                    completedApplications.filter(
                      (app) => app.assignedCourse === Course.SCIENCE
                    ).length
                  }
                </p>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-normal text-slate">
                  Commerce
                </CardTitle>
                <p className="font-serif text-3xl font-semibold text-foreground">
                  {
                    completedApplications.filter(
                      (app) => app.assignedCourse === Course.COMMERCE
                    ).length
                  }
                </p>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-normal text-slate">
                  Arts
                </CardTitle>
                <p className="font-serif text-3xl font-semibold text-foreground">
                  {
                    completedApplications.filter(
                      (app) => app.assignedCourse === Course.ARTS
                    ).length
                  }
                </p>
              </CardHeader>
            </Card>
          </div>

          <div className="overflow-hidden rounded-2xl border border-stone bg-background shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)]">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-stone bg-muted">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Grade
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Exam Score
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Assigned Course
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Completed At
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {completedApplications.map((application) => (
                    <tr
                      key={application._id}
                      className="border-b border-stone last:border-b-0 hover:bg-paper/50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {application.studentName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate">
                        {formatGradeLabel(application.applyingGrade)}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {application.examScore ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        {application.assignedCourse ? (
                          <Badge variant="success" size="sm">
                            {courseLabelMap[application.assignedCourse]}
                          </Badge>
                        ) : (
                          <span className="text-sm text-slate">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate">
                        {formatDate(application.updatedAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={routes.admissionTeam.applicationDetail(
                            application._id
                          )}
                          className="text-sm font-medium text-seal underline decoration-seal/30 underline-offset-4 transition-colors hover:text-seal-light hover:decoration-seal"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
