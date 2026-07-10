"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, helperText, id, required, children, disabled, ...props },
    ref
  ) => {
    const selectId =
      id ??
      (label
        ? `select-${label.toLowerCase().replace(/\s+/g, "-")}`
        : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="ml-1 text-danger">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error
                ? `${selectId}-error`
                : helperText
                  ? `${selectId}-helper`
                  : undefined
            }
            className={cn(
              "h-10 w-full appearance-none rounded-md border-2 bg-background px-3 pr-10 text-sm text-foreground transition-colors",
              "focus-visible:border-brass focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:bg-paper disabled:opacity-60",
              error
                ? "border-danger"
                : "border-border hover:border-brass-light",
              className
            )}
            {...props}
          >
            {children}
          </select>

          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {error && (
          <p id={`${selectId}-error`} className="text-sm font-medium text-danger-text">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${selectId}-helper`} className="text-sm text-slate">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
