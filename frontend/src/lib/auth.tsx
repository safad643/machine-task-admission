"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api, type ApiError } from "./api";
import { endpoints } from "./endpoints";
import type { LoginDto, LoginResponse, RegisterDto, SafeUser } from "@/types";

interface AuthContextValue {
  userId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<SafeUser>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<SafeUser>(endpoints.auth.me)
      .then(({ data }) => {
        setUserId(data._id);
        setRole(data.role);
      })
      .catch(() => {
        // Not authenticated or session expired; leave state empty.
        setUserId(null);
        setRole(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function login(dto: LoginDto) {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.post<LoginResponse>(endpoints.auth.login, dto);
      setUserId(data.userId);
      setRole(data.role);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }

  async function register(dto: RegisterDto) {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.post<SafeUser>(endpoints.auth.register, dto);
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);
    setError(null);

    try {
      await api.post(endpoints.auth.logout);
    } catch (err) {
      const apiError = err as ApiError;
      console.warn("Logout API call failed:", apiError.message);
    } finally {
      setUserId(null);
      setRole(null);
      setIsLoading(false);
    }
  }

  const value: AuthContextValue = {
    userId,
    role,
    isAuthenticated: Boolean(userId && role),
    isLoading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
