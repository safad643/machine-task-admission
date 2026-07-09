"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, required, ...props }, ref) => {
    const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-danger">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={cn(
            "flex h-10 w-full rounded-md border-2 bg-background px-3 py-2 text-sm text-foreground",
            "placeholder:text-slate/50",
            "focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:bg-paper disabled:opacity-60",
            error
              ? "border-danger focus-visible:ring-danger/20"
              : "border-border",
            className
          )}
          required={required}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm font-medium text-danger-text">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-sm text-slate">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
