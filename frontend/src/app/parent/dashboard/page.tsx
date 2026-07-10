import Link from "next/link";
import { routes } from "@/lib/routes";
import { endpoints } from "@/lib/endpoints";
import { fetchWithAuth } from "@/lib/data";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentTable } from "@/components/dashboard/RecentTable";
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";
import { getStatusCounts } from "@/lib/status-utils";
import { Button } from "@/components/ui";
import type { Student } from "@/types";

export default async function ParentDashboardPage() {
  const students = await fetchWithAuth<Student[]>(
    `${endpoints.students.list}?limit=5`
  );

  const statusCounts = students ? getStatusCounts(students) : null;

  return (
    <DashboardShell
      title="Parent Dashboard"
      description="Overview of your admission applications."
      actions={
        students !== null && students.length > 0 ? (
          <Button asChild variant="primary" size="md">
            <Link href={routes.parent.newStudent}>Add Student</Link>
          </Button>
        ) : null
      }
    >
      {students !== null && students.length === 0 && (
        <div className="rounded-2xl border border-stone bg-background p-12 text-center shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)]">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            No applications yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-slate">
            Get started by adding your first student to begin the admissions
            process.
          </p>
          <div className="mt-6">
            <Button asChild variant="primary" size="md">
              <Link href={routes.parent.newStudent}>Add Student</Link>
            </Button>
          </div>
        </div>
      )}

      {students !== null && students.length > 0 && statusCounts !== null && (
        <div className="flex flex-col gap-6">
          <StatsGrid total={students.length} counts={statusCounts} />

          <div className="grid gap-6 lg:grid-cols-3">
            <RecentTable
              className="lg:col-span-2"
              items={students}
              description="Your most recently added students."
              dateColumnLabel="Added"
              viewHref={routes.parent.studentDetail}
              viewAllHref={routes.parent.students}
              viewAllLabel="View all students →"
            />
            <StatusBreakdown counts={statusCounts} />
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
