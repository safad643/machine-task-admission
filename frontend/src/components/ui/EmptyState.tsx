import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-stone bg-background p-12 text-center shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)]",
        className
      )}
      {...props}
    >
      <h2 className="font-serif text-xl font-semibold text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-slate">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
);

EmptyState.displayName = "EmptyState";
