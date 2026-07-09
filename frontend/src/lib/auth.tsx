"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";
import { endpoints } from "./endpoints";
import type { SafeUser } from "@/types";

interface AuthContextValue {
  userId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isSessionLoading: boolean;
  setSession: (userId: string, role: string) => void;
  clearSession: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    api
      .get<SafeUser>(endpoints.auth.me)
      .then(({ data }) => {
        setUserId(data._id);
        setRole(data.role);
      })
      .catch(() => {
        setUserId(null);
        setRole(null);
      })
      .finally(() => {
        setIsSessionLoading(false);
      });
  }, []);

  function setSession(id: string, userRole: string) {
    setUserId(id);
    setRole(userRole);
  }

  function clearSession() {
    setUserId(null);
    setRole(null);
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
    userId,
    role,
    isAuthenticated: Boolean(userId && role),
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
