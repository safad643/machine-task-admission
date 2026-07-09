"use client";

import { useState } from "react";
import { api, type ApiError } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { useAuth } from "@/lib/auth";
import type { LoginDto, LoginResponse, RegisterDto, SafeUser } from "@/types";

export function useLogin() {
  const { setSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(data: LoginDto) {
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post<LoginResponse>(endpoints.auth.login, data);
      setSession(res.data.userId, res.data.role);
      return res.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error };
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(data: RegisterDto) {
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.post<SafeUser>(endpoints.auth.register, data);
      return res.data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { register, isLoading, error };
}
