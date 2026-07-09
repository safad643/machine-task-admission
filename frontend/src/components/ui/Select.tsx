"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, required, children, ...props }, ref) => {
    const selectId = id ?? (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-danger">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
          className={cn(
            "flex h-10 w-full rounded-md border-2 bg-background px-3 py-2 text-sm text-foreground",
            "focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:bg-paper disabled:opacity-60",
            error
              ? "border-danger focus-visible:ring-danger/20"
              : "border-border",
            className
          )}
          required={required}
          {...props}
        >
          {children}
        </select>
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
