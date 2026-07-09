"use client";

import Link from "next/link";
import { useStudentForm } from "@/hooks/useStudentForm";
import { routes } from "@/lib/routes";
import { Button, Input, Select } from "@/components/ui";
import { Gender } from "@/types";

export default function NewStudentPage() {
  const { form, submit, isMutating, error, clearError } = useStudentForm();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          Add Student
        </h1>
        <p className="mt-1 text-base text-slate">
          Enter your child&apos;s details to start their application.
        </p>
      </div>

      <div className="rounded-2xl border border-stone bg-background p-6 shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)] sm:p-8">
        <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
          <Input
            label="Student Name"
            placeholder="e.g. Jane Doe"
            error={errors.studentName?.message}
            required
            {...register("studentName")}
          />

          <Input
            label="Date of Birth"
            type="date"
            error={errors.dateOfBirth?.message}
            required
            {...register("dateOfBirth")}
          />

          <Select
            label="Gender"
            error={errors.gender?.message}
            required
            {...register("gender")}
          >
            <option value={Gender.MALE}>Male</option>
            <option value={Gender.FEMALE}>Female</option>
            <option value={Gender.OTHER}>Other</option>
          </Select>

          <Input
            label="Previous School"
            placeholder="e.g. Springdale Elementary"
            error={errors.previousSchool?.message}
            required
            {...register("previousSchool")}
          />

          <Input
            label="Applying Grade"
            placeholder="e.g. Grade 5"
            error={errors.applyingGrade?.message}
            required
            {...register("applyingGrade")}
          />

          {error && (
            <div className="rounded-lg border border-danger/20 bg-danger/10 p-3.5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-danger-text">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearError();
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              href={routes.parent.students}
              className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Cancel
            </Link>
            <Button type="submit" isLoading={isMutating}>
              Add Student
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
