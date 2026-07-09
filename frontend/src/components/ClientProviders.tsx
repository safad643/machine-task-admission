"use client";

import { AuthProvider } from "@/lib/auth";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
