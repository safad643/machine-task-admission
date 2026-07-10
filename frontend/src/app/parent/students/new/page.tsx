"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStudents } from "@/hooks/useStudents";
import { routes } from "@/lib/routes";
import { createStudentSchema, type CreateStudentFormData } from "@/lib/schemas";
import { PageShell } from "@/components/PageShell";
import { Button, Input, Select } from "@/components/ui";
import { Gender, Grade } from "@/types";
import { formatGradeLabel } from "@/lib/utils";

export default function NewStudentPage() {
  const router = useRouter();
  const { createStudent, isMutating, error, clearError } = useStudents();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      studentName: "",
      dateOfBirth: "",
      gender: Gender.MALE,
      previousSchool: "",
      applyingGrade: "" as unknown as Grade,
    },
  });

  async function submit(data: CreateStudentFormData) {
    try {
      await createStudent(data);
      router.push(routes.parent.students);
    } catch {
      // Error is already captured in useStudents; swallow to avoid
      // unhandled-rejection warnings from react-hook-form's handleSubmit.
    }
  }

  return (
    <PageShell
      title="Add Student"
      description="Enter your child&apos;s details to start their application."
      maxWidth="small"
    >
      <div className="rounded-2xl border border-stone bg-background p-6 shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)] sm:p-8">
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5" noValidate>
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

          <Select
            label="Applying Grade"
            error={errors.applyingGrade?.message}
            required
            {...register("applyingGrade")}
          >
            <option value="" disabled>
              Select a grade
            </option>
            {Object.values(Grade).map((grade) => (
              <option key={grade} value={grade}>
                {formatGradeLabel(grade)}
              </option>
            ))}
          </Select>

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
            <Button asChild variant="outline" size="md">
              <Link href={routes.parent.students}>Cancel</Link>
            </Button>
            <Button type="submit" isLoading={isMutating}>
              Add Student
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
