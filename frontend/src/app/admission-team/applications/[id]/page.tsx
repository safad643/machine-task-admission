import Link from "next/link";
import { fetchWithAuth } from "@/lib/data";
import { endpoints } from "@/lib/endpoints";
import { routes } from "@/lib/routes";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui";
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
    <PageShell
      title="Application Details"
      description="Review the full student information and current status."
      maxWidth="medium"
      backLink={{
        href: routes.admissionTeam.applications,
        label: "Back to applications",
      }}
      actions={
        <>
          {application.status === StudentStatus.SLOT_BOOKED && (
            <Button asChild variant="primary" size="md">
              <Link href={routes.admissionTeam.applicationScore(id)}>Enter Exam Score</Link>
            </Button>
          )}
          {application.status === StudentStatus.EXAM_COMPLETED && (
            <Button asChild variant="primary" size="md">
              <Link href={routes.admissionTeam.applicationAssign(id)}>Assign Course</Link>
            </Button>
          )}
        </>
      }
    >
      <StudentDetailCard student={application} />
    </PageShell>
  );
}
