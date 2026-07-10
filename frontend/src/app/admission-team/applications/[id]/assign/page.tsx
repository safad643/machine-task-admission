"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApplications } from "@/hooks/useApplications";
import { useCourseForm } from "@/hooks";
import { routes } from "@/lib/routes";
import { StudentStatus, Course } from "@/types";
import { formatGradeLabel } from "@/lib/utils";
import { Button, Loading, Select } from "@/components/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

const courseOptions = [
  { value: "", label: "Select a course" },
  { value: Course.SCIENCE, label: "Science" },
  { value: Course.COMMERCE, label: "Commerce" },
  { value: Course.ARTS, label: "Arts" },
];

export default function ApplicationAssignCoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const {
    application,
    isLoading: isLoadingApplication,
    error: applicationError,
    fetchApplication,
    clearError: clearApplicationError,
  } = useApplications();

  const {
    form,
    submit,
    isMutating,
    error: formError,
    clearError: clearFormError,
  } = useCourseForm({ initialCourse: application?.assignedCourse });

  useEffect(() => {
    if (id) {
      void fetchApplication(id);
    }
  }, [id, fetchApplication]);

  useEffect(() => {
    if (
      application &&
      application.status !== StudentStatus.EXAM_COMPLETED
    ) {
      router.replace(routes.admissionTeam.applicationDetail(id));
    }
  }, [application, id, router]);

  useEffect(() => {
    if (application?.assignedCourse) {
      form.setValue("assignedCourse", application.assignedCourse);
    }
  }, [application, form]);

  const isLoading = isLoadingApplication;
  const error = applicationError ?? formError;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href={routes.admissionTeam.applicationDetail(id)}
          className="text-sm font-medium text-slate underline decoration-slate/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          &larr; Back to application details
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          Assign Course
        </h1>
        <p className="mt-1 text-base text-slate">
          Select a course for the student to complete the admission process.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-danger/20 bg-danger/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-danger-text">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearApplicationError();
                clearFormError();
                if (id) {
                  void fetchApplication(id);
                }
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {isLoading && (
        <Card className="p-12 text-center">
          <Loading message="Loading application details..." className="min-h-0" />
        </Card>
      )}

      {!isLoading && !application && (
        <Card className="p-12 text-center">
          <p className="text-slate">Application not found.</p>
        </Card>
      )}

      {!isLoading && application && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">
              {application.studentName}
            </CardTitle>
            <CardDescription>
              Applying grade {formatGradeLabel(application.applyingGrade)} • Application ID: {application._id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
              <Select
                label="Course"
                helperText="Choose one of the available courses."
                required
                {...form.register("assignedCourse")}
                error={form.formState.errors.assignedCourse?.message}
              >
                {courseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Link href={routes.admissionTeam.applicationDetail(id)}>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isMutating}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  isLoading={isMutating}
                  className="w-full sm:w-auto"
                >
                  Assign Course
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
