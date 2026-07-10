import { ReactNode } from "react";

interface DashboardShellProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function DashboardShell({
  title,
  description,
  actions,
  children,
}: DashboardShellProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-1 text-base text-slate">{description}</p>
        </div>
        {actions ? (
          <div className="flex flex-col gap-2 sm:flex-row">{actions}</div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
