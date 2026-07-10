"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApplications } from "@/hooks/useApplications";
import { routes } from "@/lib/routes";
import { scoreSchema, type ScoreFormData } from "@/lib/schemas";
import { StudentStatus, type Student } from "@/types";
import { formatGradeLabel } from "@/lib/utils";
import { Button, Input } from "@/components/ui";
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
      // Error is already captured in useApplications; swallow to avoid
      // unhandled-rejection warnings from react-hook-form's handleSubmit.
    }
  }

  useEffect(() => {
    if (application.status !== StudentStatus.SLOT_BOOKED) {
      router.replace(routes.admissionTeam.applicationDetail(id));
    }
  }, [application, id, router]);

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

      {formError && (
        <div className="mb-6 rounded-xl border border-danger/20 bg-danger/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-danger-text">{formError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearFormError();
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      )}

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
    </div>
  );
}
