"use client";

import { cn } from "@/lib/utils";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "current" | "primary" | "danger";
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-8 w-8 border-[3px]",
};

const colorClasses = {
  current: "border-current border-t-transparent",
  primary: "border-ink border-t-transparent",
  danger: "border-danger border-t-transparent",
};

export function Loader({
  size = "md",
  color = "primary",
  className,
  label,
}: LoaderProps) {
  return (
    <span className={cn("inline-flex items-center justify-center", className)}>
      <span
        className={cn(
          "inline-block animate-spin rounded-full",
          sizeClasses[size],
          colorClasses[color]
        )}
        aria-hidden="true"
      />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
