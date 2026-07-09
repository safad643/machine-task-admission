"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApplications } from "./useApplications";
import { routes } from "@/lib/routes";
import { courseSchema, type CourseFormData } from "@/lib/schemas";
import { Course } from "@/types";

interface UseCourseFormOptions {
  initialCourse?: Course | null;
}

export function useCourseForm({ initialCourse }: UseCourseFormOptions = {}) {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const { assignCourse, isMutating, error, clearError } = useApplications();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      assignedCourse: initialCourse ?? undefined,
    },
  });

  async function submit(data: CourseFormData) {
    if (!id) return;

    try {
      await assignCourse(id, data.assignedCourse);
      router.push(routes.admissionTeam.applicationDetail(id));
    } catch {
      // Error is already captured in useApplications; swallow to avoid
      // unhandled-rejection warnings from react-hook-form's handleSubmit.
    }
  }

  return {
    form,
    submit: form.handleSubmit(submit),
    isMutating,
    error,
    clearError,
  };
}
