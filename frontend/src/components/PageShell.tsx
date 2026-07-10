import { ReactNode } from "react";
import Link from "next/link";

const maxWidthClasses = {
  small: "max-w-2xl",
  medium: "max-w-3xl",
  large: "max-w-4xl",
  wide: "max-w-6xl",
};

interface PageShellProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
  maxWidth?: keyof typeof maxWidthClasses;
  backLink?: {
    href: string;
    label: string;
  };
}

export function PageShell({
  title,
  description,
  actions,
  children,
  maxWidth = "wide",
  backLink,
}: PageShellProps) {
  return (
    <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>
      {backLink && (
        <div className="mb-6 flex items-center gap-4">
          <Link
            href={backLink.href}
            className="text-sm font-medium text-slate underline decoration-slate/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            &larr; {backLink.label}
          </Link>
        </div>
      )}

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
