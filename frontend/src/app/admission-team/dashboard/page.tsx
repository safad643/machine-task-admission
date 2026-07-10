import Link from "next/link";
import { routes } from "@/lib/routes";
import { endpoints } from "@/lib/endpoints";
import { fetchWithAuth } from "@/lib/data";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentTable } from "@/components/dashboard/RecentTable";
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";
import { getStatusCounts } from "@/lib/status-utils";
import type { Student } from "@/types";

export default async function AdmissionTeamDashboardPage() {
  const applications = await fetchWithAuth<Student[]>(
    `${endpoints.admission.applications}?limit=5`
  );

  const statusCounts = getStatusCounts(applications);

  return (
    <DashboardShell
      title="Admission Team Dashboard"
      description="Overview of all admission applications and their progress."
      actions={
        <>
          <Link
            href={routes.admissionTeam.slots}
            className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Manage Slots
          </Link>
          <Link
            href={routes.admissionTeam.applications}
            className="inline-flex h-10 items-center justify-center rounded-md border border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View Applications
          </Link>
        </>
      }
    >
      {applications.length === 0 && (
        <div className="rounded-2xl border border-stone bg-background p-12 text-center shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)]">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            No applications yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-slate">
            Applications will appear here once parents begin submitting student
            details.
          </p>
        </div>
      )}

      {applications.length > 0 && (
        <div className="flex flex-col gap-6">
          <StatsGrid total={applications.length} counts={statusCounts} />

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
    </DashboardShell>
  );
}
