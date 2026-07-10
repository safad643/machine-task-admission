import Link from "next/link";
import { routes } from "@/lib/routes";
import { endpoints } from "@/lib/endpoints";
import { fetchWithAuth } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { StudentStatus } from "@/types";
import type { BadgeProps } from "@/components/ui/Badge";
import type { Student } from "@/types";
import { formatGradeLabel } from "@/lib/utils";

const statusVariantMap: Record<StudentStatus, BadgeProps["variant"]> = {
  [StudentStatus.APPLICATION_CREATED]: "warning",
  [StudentStatus.REGISTRATION_FEE_PAID]: "secondary",
  [StudentStatus.SLOT_BOOKED]: "default",
  [StudentStatus.EXAM_COMPLETED]: "outline",
  [StudentStatus.ADMISSION_COMPLETED]: "success",
};

function formatStatusLabel(status: StudentStatus): string {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function StudentsPage() {
  const students = await fetchWithAuth<Student[]>(endpoints.students.list);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            My Students
          </h1>
          <p className="mt-1 text-base text-slate">
            Manage your children&apos;s admission applications.
          </p>
        </div>
        {students.length > 0 && (
          <Link
            href={routes.parent.newStudent}
            className="inline-flex h-10 items-center justify-center rounded-md border border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Add Student
          </Link>
        )}
      </div>

      {students.length === 0 && (
        <div className="rounded-2xl border border-stone bg-background p-12 text-center shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)]">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            No students yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-slate">
            Get started by adding your first student to begin the admissions
            process.
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
    </div>
  );
}
