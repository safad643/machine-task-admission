"use client";

import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { Loader } from "./Loader";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variantClasses = {
  primary:
    "bg-foreground text-background border-transparent hover:bg-foreground/90 focus-visible:ring-foreground/30 active:bg-foreground/95",
  secondary:
    "bg-brass text-white border-transparent hover:bg-brass/90 focus-visible:ring-brass/30 active:bg-brass/95",
  outline:
    "bg-transparent text-foreground border-border hover:border-foreground/30 hover:bg-paper focus-visible:ring-foreground/20 active:bg-paper",
  ghost:
    "bg-transparent text-foreground border-transparent hover:bg-paper focus-visible:ring-foreground/20 active:bg-paper",
  danger:
    "bg-danger text-white border-transparent hover:bg-danger/90 focus-visible:ring-danger/30 active:bg-danger/95",
};

const sizeClasses = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const buttonClasses = cn(
      "inline-flex items-center justify-center rounded-md border font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:pointer-events-none disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      className
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{
        className?: string;
        ref?: React.Ref<HTMLElement>;
        "aria-disabled"?: boolean | "true" | "false";
      }>;
      return cloneElement(child, {
        ref,
        className: cn(buttonClasses, child.props.className),
        "aria-disabled": isDisabled || undefined,
      });
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={buttonClasses}
        {...props}
      >
        {isLoading ? (
          <Loader size={size === "lg" ? "md" : "sm"} color="current" />
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
