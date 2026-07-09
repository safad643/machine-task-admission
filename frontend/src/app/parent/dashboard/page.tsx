"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useStudents } from "@/hooks/useStudents";
import { routes } from "@/lib/routes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StudentStatus } from "@/types";
import type { Student } from "@/types";
import type { BadgeProps } from "@/components/ui/Badge";

const statusVariantMap: Record<StudentStatus, BadgeProps["variant"]> = {
  [StudentStatus.APPLICATION_CREATED]: "warning",
  [StudentStatus.REGISTRATION_FEE_PAID]: "secondary",
  [StudentStatus.SLOT_BOOKED]: "default",
  [StudentStatus.EXAM_COMPLETED]: "outline",
  [StudentStatus.ADMISSION_COMPLETED]: "success",
};

const statusLabelMap: Record<StudentStatus, string> = {
  [StudentStatus.APPLICATION_CREATED]: "Application Created",
  [StudentStatus.REGISTRATION_FEE_PAID]: "Registration Fee Paid",
  [StudentStatus.SLOT_BOOKED]: "Slot Booked",
  [StudentStatus.EXAM_COMPLETED]: "Exam Completed",
  [StudentStatus.ADMISSION_COMPLETED]: "Admission Completed",
};

const statusOrder: StudentStatus[] = [
  StudentStatus.APPLICATION_CREATED,
  StudentStatus.REGISTRATION_FEE_PAID,
  StudentStatus.SLOT_BOOKED,
  StudentStatus.EXAM_COMPLETED,
  StudentStatus.ADMISSION_COMPLETED,
];

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusCounts(students: Student[]) {
  const counts = Object.fromEntries(
    statusOrder.map((status) => [status, 0])
  ) as Record<StudentStatus, number>;

  for (const student of students) {
    counts[student.status] = (counts[student.status] ?? 0) + 1;
  }

  return counts;
}

export default function ParentDashboardPage() {
  const { students, isLoading, error, fetchStudents, clearError } = useStudents();

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const totalStudents = students?.length ?? 0;
  const statusCounts = students ? getStatusCounts(students) : null;
  const recentStudents = students ? [...students].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5) : [];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Parent Dashboard
          </h1>
          <p className="mt-1 text-base text-slate">
            Overview of your admission applications.
          </p>
        </div>
        <Link
          href={routes.parent.newStudent}
          className="inline-flex h-10 items-center justify-center rounded-md border border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Add Student
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
                fetchStudents();
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="rounded-2xl border border-stone bg-background p-12 text-center">
          <p className="text-slate">Loading dashboard...</p>
        </div>
      )}

      {!isLoading && students !== null && students.length === 0 && (
        <div className="rounded-2xl border border-stone bg-background p-12 text-center shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)]">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            No applications yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-slate">
            Get started by adding your first student to begin the admissions process.
          </p>
          <div className="mt-6">
            <Link
              href={routes.parent.newStudent}
              className="inline-flex h-10 items-center justify-center rounded-md border border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Add Student
            </Link>
          </div>
        </div>
      )}

      {!isLoading && students !== null && students.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>Total Applications</CardDescription>
                <CardTitle className="text-3xl">{totalStudents}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Pending Payment</CardDescription>
                <CardTitle className="text-3xl">
                  {statusCounts?.[StudentStatus.APPLICATION_CREATED] ?? 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Exam Booked</CardDescription>
                <CardTitle className="text-3xl">
                  {statusCounts?.[StudentStatus.SLOT_BOOKED] ?? 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Completed</CardDescription>
                <CardTitle className="text-3xl">
                  {statusCounts?.[StudentStatus.ADMISSION_COMPLETED] ?? 0}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Your most recently added students.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-xl border border-stone">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="border-b border-stone bg-muted">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Grade
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                          Added
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentStudents.map((student) => (
                        <tr
                          key={student._id}
                          className="border-b border-stone last:border-b-0 hover:bg-paper/50"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            {student.studentName}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate">
                            {student.applyingGrade}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={statusVariantMap[student.status]} size="sm">
                              {statusLabelMap[student.status]}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate">
                            {formatDate(student.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link
                              href={routes.parent.studentDetail(student._id)}
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

                <div className="mt-4">
                  <Link
                    href={routes.parent.students}
                    className="text-sm font-medium text-seal underline decoration-seal/30 underline-offset-4 transition-colors hover:text-seal-light hover:decoration-seal"
                  >
                    View all students &rarr;
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
                <CardDescription>Applications by current status.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {statusOrder.map((status) => (
                    <li
                      key={status}
                      className="flex items-center justify-between rounded-lg border border-stone bg-paper/50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant={statusVariantMap[status]} size="sm">
                          {statusLabelMap[status]}
                        </Badge>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {statusCounts?.[status] ?? 0}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
