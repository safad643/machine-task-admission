"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";
import { endpoints } from "./endpoints";
import type { SafeUser } from "@/types";

interface AuthContextValue {
  user: SafeUser | null;
  userId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isSessionLoading: boolean;
  setSession: (user: SafeUser) => void;
  clearSession: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    api
      .get<SafeUser>(endpoints.auth.me)
      .then(({ data }) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsSessionLoading(false);
      });
  }, []);

  function setSession(nextUser: SafeUser) {
    setUser(nextUser);
  }

  function clearSession() {
    setUser(null);
  }

  async function logout() {
    try {
      await api.post(endpoints.auth.logout);
    } catch {
      // best-effort; clear session regardless
    }
    clearSession();
  }

  const value: AuthContextValue = {
    user,
    userId: user?._id ?? null,
    role: user?.role ?? null,
    isAuthenticated: Boolean(user),
    isSessionLoading,
    setSession,
    clearSession,
    logout,
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
