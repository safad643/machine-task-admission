"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApplications } from "./useApplications";
import { routes } from "@/lib/routes";
import { scoreSchema, type ScoreFormData } from "@/lib/schemas";

interface UseScoreFormOptions {
  initialScore?: number | null;
}

export function useScoreForm({ initialScore }: UseScoreFormOptions = {}) {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const { assignScore, isMutating, error, clearError } = useApplications();

  const form = useForm<ScoreFormData>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      examScore: initialScore ?? undefined,
    },
  });

  async function submit(data: ScoreFormData) {
    if (!id) return;

    try {
      await assignScore(id, data.examScore);
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
