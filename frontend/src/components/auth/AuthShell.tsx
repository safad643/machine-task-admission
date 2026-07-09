"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-ivory">
      {/* Visual panel — hidden on small screens, signature side on desktop */}
      <aside className="auth-panel relative hidden w-[42%] flex-col justify-between overflow-hidden border-r border-stone/60 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-parchment via-parchment to-stone/30" />

        <div className="relative z-10 px-10 pt-12">
          <Link
            href={routes.login}
            className="inline-flex items-center gap-3 text-foreground transition-opacity hover:opacity-80"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-ivory">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3L2 9L12 15L22 9L12 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 15L12 21L22 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight">Admissions</span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-10">
          <div className="relative">
            <div className="absolute -inset-12 rounded-full bg-brass/5 blur-3xl" />
            <AdmissionEnvelope className="relative z-10 h-56 w-56 text-foreground drop-shadow-2xl" />
          </div>

          <div className="mt-10 max-w-xs text-center">
            <p className="font-serif text-3xl font-medium leading-snug text-foreground">
              Your child&apos;s next chapter, delivered with care.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-sage">
              A calm, organized way to manage school admissions, exam slots, and applications.
            </p>
          </div>
        </div>

        <div className="relative z-10 px-10 pb-16">
          <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-sage">
            <span>Trusted by parents</span>
            <span className="h-px flex-1 bg-stone" />
            <span>Est. 2026</span>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex w-full flex-col justify-center px-6 py-12 lg:w-[58%] lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile-only brand mark */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-ivory">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3L2 9L12 15L22 9L12 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 15L12 21L22 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-serif text-lg font-semibold tracking-tight">Admissions</span>
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground xl:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-base text-sage">{subtitle}</p>
          </div>

          <div className="rounded-2xl border border-stone bg-background p-6 shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)] sm:p-8">
            {children}
          </div>

          <div className="mt-6 text-center text-sm text-slate">{footer}</div>
        </div>
      </main>
    </div>
  );
}

function AdmissionEnvelope({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Envelope body */}
      <rect
        x="20"
        y="60"
        width="160"
        height="110"
        rx="4"
        className="fill-ivory stroke-foreground"
        strokeWidth="2"
      />
      {/* Envelope flap */}
      <path
        d="M20 60 L100 125 L180 60"
        className="fill-parchment stroke-foreground"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Inner shadow line */}
      <path
        d="M20 60 L100 125 L180 60"
        className="stroke-stone"
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* Wax seal */}
      <g className="animate-seal-pulse">
        <circle cx="100" cy="112" r="22" className="fill-seal" />
        <circle cx="100" cy="112" r="16" className="fill-seal-light" opacity="0.25" />
        <text
          x="100"
          y="117"
          textAnchor="middle"
          className="fill-[#FDFCF8]"
          style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-crimson-pro), serif" }}
        >
          A
        </text>
      </g>
      {/* Floating document peeking out */}
      <g className="animate-float">
        <rect
          x="55"
          y="25"
          width="90"
          height="70"
          rx="3"
          className="fill-background stroke-foreground"
          strokeWidth="2"
        />
        <line x1="70" y1="45" x2="130" y2="45" className="stroke-sage" strokeWidth="2" strokeLinecap="round" />
        <line x1="70" y1="58" x2="120" y2="58" className="stroke-sage" strokeWidth="2" strokeLinecap="round" />
        <line x1="70" y1="71" x2="110" y2="71" className="stroke-sage" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
