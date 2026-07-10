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
import type { Student } from "@/types";

export default async function ParentDashboardPage() {
  const students = await fetchWithAuth<Student[]>(
    `${endpoints.students.list}?limit=5`
  );

  const statusCounts = students ? getStatusCounts(students) : null;

  return (
    <PageShell
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
        <EmptyState
          title="No applications yet"
          description="Get started by adding your first student to begin the admissions process."
          action={
            <Button asChild variant="primary" size="md">
              <Link href={routes.parent.newStudent}>Add Student</Link>
            </Button>
          }
        />
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
    </PageShell>
  );
}
