import Link from "next/link";
import { fetchWithAuth } from "@/lib/data";
import { endpoints } from "@/lib/endpoints";
import { routes } from "@/lib/routes";
import { Student, StudentStatus } from "@/types";
import { StudentDetailCard } from "@/app/parent/students/[id]/components/StudentDetailCard";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await fetchWithAuth<Student>(
    endpoints.admission.applicationDetail(id)
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={routes.admissionTeam.applications}
          className="text-sm font-medium text-slate underline decoration-slate/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          &larr; Back to applications
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Application Details
          </h1>
          <p className="mt-1 text-base text-slate">
            Review the full student information and current status.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {application.status === StudentStatus.SLOT_BOOKED && (
            <Link
              href={routes.admissionTeam.applicationScore(id)}
              className="inline-flex h-10 items-center justify-center rounded-md border border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Enter Exam Score
            </Link>
          )}
          {application.status === StudentStatus.EXAM_COMPLETED && (
            <Link
              href={routes.admissionTeam.applicationAssign(id)}
              className="inline-flex h-10 items-center justify-center rounded-md border border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Assign Course
            </Link>
          )}
        </div>
      </div>

      <StudentDetailCard student={application} />
    </div>
  );
}
