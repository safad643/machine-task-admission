"use client";

import { Button } from "@/components/ui/Button";

export default function AdmissionTeamError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl py-12">
      <div className="rounded-xl border border-danger/20 bg-danger/10 p-6 text-center">
        <h2 className="font-serif text-xl font-semibold text-danger-text">
          Something went wrong
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-danger-text">
          {error.message || "Failed to load page data."}
        </p>
        <Button variant="outline" size="sm" onClick={reset} className="mt-4">
          Try again
        </Button>
      </div>
    </div>
  );
}
