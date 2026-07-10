"use client";

import { Alert } from "@/components/ui";

export default function AdmissionTeamError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl py-12">
      <Alert
        title="Something went wrong"
        message={error.message || "Failed to load page data."}
        onDismiss={reset}
        dismissLabel="Try again"
        className="text-center"
      />
    </div>
  );
}
