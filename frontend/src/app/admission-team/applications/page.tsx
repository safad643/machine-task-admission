"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApplications } from "@/hooks/useApplications";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { StudentStatus } from "@/types";
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
  [StudentStatus.ADMISSION_COMPLETED]: "Completed",
};

const statusOrder: StudentStatus[] = [
  StudentStatus.APPLICATION_CREATED,
  StudentStatus.REGISTRATION_FEE_PAID,
  StudentStatus.SLOT_BOOKED,
  StudentStatus.EXAM_COMPLETED,
  StudentStatus.ADMISSION_COMPLETED,
];

const filterOptions: Array<{ value: "ALL" | StudentStatus; label: string }> = [
  { value: "ALL", label: "All Applications" },
  ...statusOrder.map((status) => ({
    value: status,
    label: statusLabelMap[status],
  })),
];

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ApplicationsPage() {
  const {
    applications,
    isLoading,
    error,
    fetchApplications,
    clearError,
  } = useApplications();
  const [statusFilter, setStatusFilter] = useState<"ALL" | StudentStatus>("ALL");

  useEffect(() => {
    fetchApplications(statusFilter === "ALL" ? undefined : statusFilter);
  }, [fetchApplications, statusFilter]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Student Applications
          </h1>
          <p className="mt-1 text-base text-slate">
            Review and manage all admission applications.
          </p>
        </div>
        <Link
          href={routes.admissionTeam.slots}
          className="inline-flex h-10 items-center justify-center rounded-md border border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Manage Slots
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full sm:w-72">
          <Select
            label="Filter by status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | StudentStatus)
            }
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
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
                fetchApplications(
                  statusFilter === "ALL" ? undefined : statusFilter
                );
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="rounded-2xl border border-stone bg-background p-12 text-center">
          <p className="text-slate">Loading applications...</p>
        </div>
      )}

      {!isLoading && applications !== null && applications.length === 0 && (
        <div className="rounded-2xl border border-stone bg-background p-12 text-center shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)]">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            No applications found
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-slate">
            {statusFilter === "ALL"
              ? "Applications will appear here once parents begin submitting student details."
              : "No applications match the selected status filter."}
          </p>
        </div>
      )}

      {!isLoading && applications !== null && applications.length > 0 && (
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
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr
                    key={application._id}
                    className="border-b border-stone last:border-b-0 hover:bg-paper/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {application.studentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate">
                      {application.applyingGrade}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={statusVariantMap[application.status]}
                        size="sm"
                      >
                        {statusLabelMap[application.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate">
                      {formatDate(application.createdAt)}
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
      )}
    </div>
  );
}
