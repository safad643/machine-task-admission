"use client";

import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Button } from "./Button";

export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
}

export interface LayoutProps {
  children: ReactNode;
  title?: string;
  navItems?: NavItem[];
}

export function Layout({
  children,
  title,
  navItems = [],
}: LayoutProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-paper lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-sm font-bold text-background">
            SA
          </div>
          <span className="font-serif text-lg font-semibold text-foreground">
            Admissions
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                item.active
                  ? "bg-foreground text-background"
                  : "text-slate hover:bg-background hover:text-foreground"
              )}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {item.label}
            </a>
          ))}
        </nav>

        {user && (
          <div className="border-t border-border p-4">
            <div className="rounded-md bg-background p-3">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-slate">{user.role}</p>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="mt-2 justify-start"
                onClick={() => logout()}
              >
                Sign out
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <span className="font-serif text-lg font-semibold text-foreground lg:hidden">
              Admissions
            </span>
          </div>

          {title && (
            <h1 className="hidden font-serif text-xl font-semibold text-foreground lg:block">
              {title}
            </h1>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden text-right lg:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-slate">{user.role}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
          )}
        </header>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-b border-border bg-paper px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    item.active
                      ? "bg-foreground text-background"
                      : "text-slate hover:bg-background hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && (
                    <span className="flex-shrink-0">{item.icon}</span>
                  )}
                  {item.label}
                </a>
              ))}
            </nav>
            {user && (
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="mt-3 justify-start"
                onClick={() => logout()}
              >
                Sign out
              </Button>
            )}
          </div>
        )}

        <main className="flex-1 p-4 lg:p-8">
          {title && (
            <h1 className="mb-6 font-serif text-2xl font-semibold text-foreground lg:hidden">
              {title}
            </h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
