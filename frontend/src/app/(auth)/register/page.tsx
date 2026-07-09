"use client";

import Link from "next/link";
import { useRegisterForm } from "@/hooks";
import { routes } from "@/lib/routes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";

export default function RegisterPage() {
  const { form, submit, isLoading, error } = useRegisterForm();
  const { register, formState: { errors } } = form;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center pb-2">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Register as a parent to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Full name"
              type="text"
              placeholder="John Doe"
              error={errors.name?.message}
              autoComplete="name"
              required
              {...register("name")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              autoComplete="email"
              required
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              autoComplete="new-password"
              required
              {...register("password")}
            />

            {error && (
              <p className="rounded-md bg-danger/10 px-3 py-2 text-sm font-medium text-danger-text">
                {error}
              </p>
            )}

            <Button type="submit" variant="secondary" size="lg" fullWidth isLoading={isLoading}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate">
            Already have an account?{" "}
            <Link href={routes.login} className="font-medium text-brass hover:text-brass-light transition-colors">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
