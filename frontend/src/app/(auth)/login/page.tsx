"use client";

import Link from "next/link";
import { useLoginForm } from "@/hooks";
import { routes } from "@/lib/routes";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";

export default function LoginPage() {
  const { form, submit, isLoading, error } = useLoginForm();
  const { register, formState: { errors } } = form;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your child&apos;s admissions journey."
      footer={
        <>
          No account yet?{" "}
          <Link
            href={routes.register}
            className="font-medium text-seal underline decoration-seal/30 underline-offset-4 transition-colors hover:text-seal-light hover:decoration-seal"
          >
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          autoComplete="email"
          required
          className="h-12"
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          autoComplete="current-password"
          required
          className="h-12"
          {...register("password")}
        />

        {error && (
          <p className="rounded-lg bg-danger/10 px-3.5 py-2.5 text-sm font-medium text-danger-text">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="mt-1 h-12"
        >
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
