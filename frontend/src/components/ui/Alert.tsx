import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface AlertProps {
  message: string | null | undefined;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
  variant?: "danger" | "warning";
  title?: string;
}

export const Alert = ({
  message,
  onDismiss,
  dismissLabel = "Clear",
  className,
  variant = "danger",
  title,
}: AlertProps) => {
  if (!message) {
    return null;
  }

  const isDanger = variant === "danger";
  const hasTitle = !!title;

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        hasTitle
          ? "flex flex-col items-center gap-4 text-center"
          : "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        isDanger
          ? "border-danger/20 bg-danger/10"
          : "border-warning/20 bg-warning/10",
        className
      )}
      role="alert"
    >
      <div
        className={cn(
          "flex flex-col",
          hasTitle ? "items-center gap-2" : ""
        )}
      >
        {hasTitle && (
          <h2
            className={cn(
              "font-serif text-xl font-semibold",
              isDanger ? "text-danger-text" : "text-warning"
            )}
          >
            {title}
          </h2>
        )}
        <p
          className={cn(
            "text-sm font-medium",
            hasTitle ? "mx-auto max-w-md" : "",
            isDanger ? "text-danger-text" : "text-warning"
          )}
        >
          {message}
        </p>
      </div>
      {onDismiss && (
        <Button variant="outline" size="sm" onClick={onDismiss}>
          {dismissLabel}
        </Button>
      )}
    </div>
  );
};
