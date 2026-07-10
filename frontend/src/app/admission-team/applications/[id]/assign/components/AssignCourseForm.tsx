"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApplications } from "@/hooks/useApplications";
import { routes } from "@/lib/routes";
import { courseSchema, type CourseFormData } from "@/lib/schemas";
import { StudentStatus, Course, type Student } from "@/types";
import { formatGradeLabel, courseLabelMap } from "@/lib/utils";
import { Button, Select } from "@/components/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

const courseOptions = [
  { value: "", label: "Select a course" },
  { value: Course.SCIENCE, label: courseLabelMap[Course.SCIENCE] },
  { value: Course.COMMERCE, label: courseLabelMap[Course.COMMERCE] },
  { value: Course.ARTS, label: courseLabelMap[Course.ARTS] },
];

interface AssignCourseFormProps {
  application: Student;
  id: string;
}

export default function AssignCourseForm({
  application,
  id,
}: AssignCourseFormProps) {
  const router = useRouter();
  const { assignCourse, isMutating, error: formError, clearError: clearFormError } = useApplications();
  const { register, handleSubmit, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      assignedCourse: application.assignedCourse ?? undefined,
    },
  });

  async function submit(data: CourseFormData) {
    try {
      await assignCourse(id, data.assignedCourse);
      router.push(routes.admissionTeam.applicationDetail(id));
    } catch {
      // Error is already captured in useApplications; swallow to avoid
      // unhandled-rejection warnings from react-hook-form's handleSubmit.
    }
  }

  useEffect(() => {
    if (application.status !== StudentStatus.EXAM_COMPLETED) {
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
          Assign Course
        </h1>
        <p className="mt-1 text-base text-slate">
          Select a course for the student to complete the admission process.
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
            <Select
              label="Course"
              helperText="Choose one of the available courses."
              required
              {...register("assignedCourse")}
              error={errors.assignedCourse?.message}
            >
              {courseOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

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
                Assign Course
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
