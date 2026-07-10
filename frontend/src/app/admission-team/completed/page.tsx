import Link from "next/link";
import { routes } from "@/lib/routes";
import { endpoints } from "@/lib/endpoints";
import { fetchWithAuth } from "@/lib/data";
import { PageShell } from "@/components/PageShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StudentStatus, Course } from "@/types";
import type { Student } from "@/types";
import { formatGradeLabel, courseLabelMap } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";

function getCompletedApplications(applications: Student[]): Student[] {
  return applications
    .filter((app) => app.status === StudentStatus.ADMISSION_COMPLETED)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export default async function CompletedAdmissionsPage() {
  const applications = await fetchWithAuth<Student[]>(
    `${endpoints.admission.applications}?status=ADMISSION_COMPLETED`
  );

  const completedApplications = getCompletedApplications(applications);
  const completedCount = completedApplications.length;

  return (
    <PageShell
      title="Completed Admissions"
      description="View all finalized admissions with scores and assigned courses."
      actions={
        <Button asChild variant="outline" size="md">
          <Link href={routes.admissionTeam.applications}>Back to Applications</Link>
        </Button>
      }
    >
      {completedCount === 0 && (
        <EmptyState
          title="No completed admissions yet"
          description="Completed admissions will appear here once the admission team assigns courses to students who have finished their exams."
          action={
            <Link
              href={routes.admissionTeam.applications}
              className="text-sm font-medium text-seal underline decoration-seal/30 underline-offset-4 transition-colors hover:text-seal-light hover:decoration-seal"
            >
              Go to applications &rarr;
            </Link>
          }
        />
      )}

      {completedCount > 0 && (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-normal text-slate">
                  Completed Admissions
                </CardTitle>
                <p className="font-serif text-3xl font-semibold text-foreground">
                  {completedCount}
                </p>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-normal text-slate">
                  Science
                </CardTitle>
                <p className="font-serif text-3xl font-semibold text-foreground">
                  {
                    completedApplications.filter(
                      (app) => app.assignedCourse === Course.SCIENCE
                    ).length
                  }
                </p>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-normal text-slate">
                  Commerce
                </CardTitle>
                <p className="font-serif text-3xl font-semibold text-foreground">
                  {
                    completedApplications.filter(
                      (app) => app.assignedCourse === Course.COMMERCE
                    ).length
                  }
                </p>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-normal text-slate">
                  Arts
                </CardTitle>
                <p className="font-serif text-3xl font-semibold text-foreground">
                  {
                    completedApplications.filter(
                      (app) => app.assignedCourse === Course.ARTS
                    ).length
                  }
                </p>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardContent>
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
                        Exam Score
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Assigned Course
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Completed At
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedApplications.map((application) => (
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
                        <td className="px-6 py-4 text-sm text-foreground">
                          {application.examScore ?? "—"}
                        </td>
                        <td className="px-6 py-4">
                          {application.assignedCourse ? (
                            <Badge variant="success" size="sm">
                              {courseLabelMap[application.assignedCourse]}
                            </Badge>
                          ) : (
                            <span className="text-sm text-slate">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate">
                          {formatDate(application.updatedAt)}
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
            </CardContent>
          </Card>
        </div>
      )}
    </PageShell>
  );
}
