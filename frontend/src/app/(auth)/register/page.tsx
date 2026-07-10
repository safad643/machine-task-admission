"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/hooks/useAuth";
import { routes } from "@/lib/routes";
import { registerSchema, type RegisterFormData } from "@/lib/schemas";
import { Alert, Button } from "@/components/ui";
import { Input } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error } = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function submit(data: RegisterFormData) {
    try {
      await registerUser(data);
      router.push("/login");
    } catch {
      // Error is already captured in useRegister.
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground xl:text-5xl">
          Create an account
        </h1>
        <p className="mt-3 text-base text-sage">Register as a parent to start organizing applications and exam slots.</p>
      </div>

      <div className="rounded-2xl border border-stone bg-background p-6 shadow-[0_2px_24px_-8px_rgba(16,16,46,0.08)] sm:p-8">
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5" noValidate>
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

          <Alert message={error} className="rounded-lg" />

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
      </div>

      <div className="mt-6 text-center text-sm text-slate">
        Already have an account?{" "}
        <Link
          href={routes.login}
          className="font-medium text-seal underline decoration-seal/30 underline-offset-4 transition-colors hover:text-seal-light hover:decoration-seal"
        >
          Sign in
        </Link>
      </div>
    </>
  );
}
