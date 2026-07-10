"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApplications } from "@/hooks";
import { routes } from "@/lib/routes";
import { scoreSchema, type ScoreFormData } from "@/lib/schemas";
import { PageShell } from "@/components/PageShell";
import { StudentStatus, type Student } from "@/types";
import { formatGradeLabel } from "@/lib/utils";
import { Alert, Button, Input } from "@/components/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

interface ScoreFormProps {
  application: Student;
  id: string;
}

export default function ScoreForm({ application, id }: ScoreFormProps) {
  const router = useRouter();
  const { assignScore, isMutating, error: formError, clearError: clearFormError } = useApplications();

  const { register, handleSubmit, formState: { errors } } = useForm<ScoreFormData>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      examScore: application.examScore ?? undefined,
    },
  });

  async function submit(data: ScoreFormData) {
    try {
      await assignScore(id, data.examScore);
      router.push(routes.admissionTeam.applicationDetail(id));
    } catch {
      // Error is already captured in useApplications.
    }
  }

  useEffect(() => {
    if (application.status !== StudentStatus.SLOT_BOOKED) {
      router.replace(routes.admissionTeam.applicationDetail(id));
    }
  }, [application, id, router]);

  return (
    <PageShell
      title="Enter Exam Score"
      description="Record the student&apos;s exam marks. Score must be between 0 and 100."
      maxWidth="small"
      backLink={{
        href: routes.admissionTeam.applicationDetail(id),
        label: "Back to application details",
      }}
    >
      <Alert message={formError} onDismiss={clearFormError} dismissLabel="Try again" className="mb-6" />

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
          <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5" noValidate>
            <Input
              label="Exam Score"
              type="number"
              min={0}
              max={100}
              step={1}
              placeholder="e.g. 85"
              helperText="Enter a whole number between 0 and 100."
              required
              {...register("examScore", { valueAsNumber: true })}
              error={errors.examScore?.message}
            />

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                asChild
                type="button"
                variant="outline"
                disabled={isMutating}
                className="w-full sm:w-auto"
              >
                <Link href={routes.admissionTeam.applicationDetail(id)}>Cancel</Link>
              </Button>
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
    </PageShell>
  );
}
