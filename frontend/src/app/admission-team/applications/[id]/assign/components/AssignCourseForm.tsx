"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApplications } from "@/hooks";
import { routes } from "@/lib/routes";
import { courseSchema, type CourseFormData } from "@/lib/schemas";
import { PageShell } from "@/components/PageShell";
import { StudentStatus, Course, type Student } from "@/types";
import { formatGradeLabel, courseLabelMap } from "@/lib/utils";
import { Alert, Button, Select } from "@/components/ui";
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
      // Error is already captured in useApplications.
    }
  }

  useEffect(() => {
    if (application.status !== StudentStatus.EXAM_COMPLETED) {
      router.replace(routes.admissionTeam.applicationDetail(id));
    }
  }, [application, id, router]);

  return (
    <PageShell
      title="Assign Course"
      description="Select a course for the student to complete the admission process."
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
    </PageShell>
  );
}
