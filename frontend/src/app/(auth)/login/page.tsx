"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/hooks/useAuth";
import { routes, getDashboardForRole } from "@/lib/routes";
import { loginSchema, type LoginFormData } from "@/lib/schemas";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function submit(data: LoginFormData) {
    try {
      const res = await login(data);
      router.push(getDashboardForRole(res.role));
    } catch {
      // Error is already captured in useLogin; swallow to avoid
      // unhandled-rejection warnings from react-hook-form's handleSubmit.
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground xl:text-5xl">
          Welcome back
        </h1>
        <p className="mt-3 text-base text-sage">Sign in to continue your child&apos;s admissions journey.</p>
      </div>

      <div className="rounded-2xl border border-stone bg-background p-6 shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)] sm:p-8">
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5" noValidate>
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
      </div>

      <div className="mt-6 text-center text-sm text-slate">
        No account yet?{" "}
        <Link
          href={routes.register}
          className="font-medium text-seal underline decoration-seal/30 underline-offset-4 transition-colors hover:text-seal-light hover:decoration-seal"
        >
          Create one
        </Link>
      </div>
    </>
  );
}
