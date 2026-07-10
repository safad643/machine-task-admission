import Link from "next/link";
import { routes } from "@/lib/routes";
import { endpoints } from "@/lib/endpoints";
import { fetchWithAuth } from "@/lib/data";
import { PageShell } from "@/components/PageShell";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui";
import type { Student } from "@/types";
import { formatGradeLabel } from "@/lib/utils";
import {
  statusVariantMap,
  formatStatusLabel,
} from "@/lib/status-utils";
import { formatDate } from "@/lib/date-utils";

export default async function StudentsPage() {
  const students = await fetchWithAuth<Student[]>(endpoints.students.list);

  return (
    <PageShell
      title="My Students"
      description="Manage your children&apos;s admission applications."
      actions={
        students.length > 0 && (
          <Button asChild variant="primary" size="md">
            <Link href={routes.parent.newStudent}>Add Student</Link>
          </Button>
        )
      }
    >
      {students.length === 0 && (
        <EmptyState
          title="No students yet"
          description="Get started by adding your first student to begin the admissions process."
          action={
            <Button asChild variant="primary" size="md">
              <Link href={routes.parent.newStudent}>Add Student</Link>
            </Button>
          }
        />
      )}

      {students.length > 0 && (
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
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b border-stone last:border-b-0 hover:bg-paper/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {student.studentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate">
                      {formatGradeLabel(student.applyingGrade)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariantMap[student.status]} size="sm">
                        {formatStatusLabel(student.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate">
                      {formatDate(student.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
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
        </div>
      )}
    </PageShell>
  );
}
