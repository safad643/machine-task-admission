"use client";

import { Button } from "./Button";
import { cn } from "@/lib/utils";

export interface ConfirmationProps {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

export function Confirmation({
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
  onConfirm,
  onCancel,
  className,
}: ConfirmationProps) {
  const confirmVariant =
    variant === "danger" ? "danger" : variant === "warning" ? "secondary" : "primary";

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background p-6 shadow-sm",
        className
      )}
    >
      <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-slate">{description}</p>
      )}
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={confirmVariant}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}

Confirmation.displayName = "Confirmation";
