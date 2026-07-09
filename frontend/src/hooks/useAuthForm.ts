"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin, useRegister } from "./useAuth";
import { getDashboardForRole } from "@/lib/routes";
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from "@/lib/schemas";

export function useLoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();
  const form = useForm<LoginFormData>({
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

  return { form, submit: form.handleSubmit(submit), isLoading, error };
}

export function useRegisterForm() {
  const router = useRouter();
  const { register, isLoading, error } = useRegister();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function submit(data: RegisterFormData) {
    try {
      await register(data);
      router.push("/login");
    } catch {
      // Error is already captured in useRegister.
    }
  }

  return { form, submit: form.handleSubmit(submit), isLoading, error };
}
