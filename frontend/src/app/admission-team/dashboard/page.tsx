import Link from "next/link";
import { routes } from "@/lib/routes";
import { endpoints } from "@/lib/endpoints";
import { fetchWithAuth } from "@/lib/data";
import { PageShell } from "@/components/PageShell";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentTable } from "@/components/dashboard/RecentTable";
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";
import { getStatusCounts } from "@/lib/status-utils";
import { Button } from "@/components/ui";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PaginatedResponse, Student } from "@/types";

export default async function AdmissionTeamDashboardPage() {
  const response = await fetchWithAuth<PaginatedResponse<Student>>(
    `${endpoints.admission.applications}?limit=5`
  );

  const applications = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];
  const total = Array.isArray(response) ? applications.length : response.total;
  const statusCounts = getStatusCounts(applications);

  return (
    <PageShell
      title="Admission Team Dashboard"
      description="Overview of all admission applications and their progress."
      actions={
        <>
          <Button asChild variant="outline" size="md">
            <Link href={routes.admissionTeam.slots}>Manage Slots</Link>
          </Button>
          <Button asChild variant="primary" size="md">
            <Link href={routes.admissionTeam.applications}>View Applications</Link>
          </Button>
        </>
      }
    >
      {applications.length === 0 && (
        <EmptyState
          title="No applications yet"
          description="Applications will appear here once parents begin submitting student details."
        />
      )}

      {applications.length > 0 && (
        <div className="flex flex-col gap-6">
          <StatsGrid total={total} counts={statusCounts} />

          <div className="grid gap-6 lg:grid-cols-3">
            <RecentTable
              className="lg:col-span-2"
              items={applications}
              description="The most recently submitted student applications."
              dateColumnLabel="Submitted"
              viewHref={routes.admissionTeam.applicationDetail}
              viewAllHref={routes.admissionTeam.applications}
              viewAllLabel="View all applications →"
            />
            <StatusBreakdown counts={statusCounts} />
          </div>
        </div>
      )}
    </PageShell>
  );
}
