"use client";

import { useState } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { PageShell } from "@/components/PageShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { StudentStatus } from "@/types";
import type { Student } from "@/types";
import { formatGradeLabel } from "@/lib/utils";
import {
  statusVariantMap,
  statusLabelMap,
  statusOrder,
} from "@/lib/status-utils";
import { formatDate } from "@/lib/date-utils";

const filterOptions: Array<{ value: "ALL" | StudentStatus; label: string }> = [
  { value: "ALL", label: "All Applications" },
  ...statusOrder.map((status) => ({
    value: status,
    label: statusLabelMap[status],
  })),
];

interface ApplicationsListProps {
  applications: Student[];
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  const [statusFilter, setStatusFilter] = useState<"ALL" | StudentStatus>("ALL");

  const filteredApplications =
    statusFilter === "ALL"
      ? applications
      : applications.filter((application) => application.status === statusFilter);

  return (
    <PageShell
      title="Student Applications"
      description="Review and manage all admission applications."
      actions={
        <Button asChild variant="primary" size="md">
          <Link href={routes.admissionTeam.slots}>Manage Slots</Link>
        </Button>
      }
    >
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

      {filteredApplications.length === 0 && (
        <EmptyState
          title="No applications found"
          description={
            statusFilter === "ALL"
              ? "Applications will appear here once parents begin submitting student details."
              : "No applications match the selected status filter."
          }
        />
      )}

      {filteredApplications.length > 0 && (
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
                {filteredApplications.map((application) => (
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
    </PageShell>
  );
}
