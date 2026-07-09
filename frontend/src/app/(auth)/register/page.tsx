"use client";

import Link from "next/link";
import { useRegisterForm } from "@/hooks";
import { routes } from "@/lib/routes";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";

export default function RegisterPage() {
  const { form, submit, isLoading, error } = useRegisterForm();
  const { register, formState: { errors } } = form;

  return (
    <AuthShell
      title="Create an account"
      subtitle="Register as a parent to start organizing applications and exam slots."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={routes.login}
            className="font-medium text-seal underline decoration-seal/30 underline-offset-4 transition-colors hover:text-seal-light hover:decoration-seal"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
        <Input
          label="Full name"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          autoComplete="name"
          required
          className="h-12"
          {...register("name")}
        />

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
          placeholder="At least 8 characters"
          error={errors.password?.message}
          autoComplete="new-password"
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
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
