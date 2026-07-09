"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApplications } from "@/hooks/useApplications";
import { useScoreForm } from "@/hooks";
import { routes } from "@/lib/routes";
import { StudentStatus } from "@/types";
import { Button, Input } from "@/components/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

export default function ApplicationScorePage() {
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
  } = useScoreForm({ initialScore: application?.examScore });

  useEffect(() => {
    if (id) {
      void fetchApplication(id);
    }
  }, [id, fetchApplication]);

  useEffect(() => {
    if (
      application &&
      application.status !== StudentStatus.SLOT_BOOKED
    ) {
      router.replace(routes.admissionTeam.applicationDetail(id));
    }
  }, [application, id, router]);

  useEffect(() => {
    if (application?.examScore !== null && application?.examScore !== undefined) {
      form.setValue("examScore", application.examScore);
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
          Enter Exam Score
        </h1>
        <p className="mt-1 text-base text-slate">
          Record the student&apos;s exam marks. Score must be between 0 and 100.
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
          <p className="text-slate">Loading application details...</p>
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
              Applying grade {application.applyingGrade} • Application ID: {application._id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
              <Input
                label="Exam Score"
                type="number"
                min={0}
                max={100}
                step={1}
                placeholder="e.g. 85"
                helperText="Enter a whole number between 0 and 100."
                required
                {...form.register("examScore", { valueAsNumber: true })}
                error={form.formState.errors.examScore?.message}
              />

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
                  Save Score
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
