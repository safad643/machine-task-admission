import { headers } from "next/headers";

export async function fetchWithAuth<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const cookie = (await headers()).get("cookie") ?? "";
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:5000";

  const response = await fetch(`${backendUrl}${path}`, {
    ...init,
    headers: {
      cookie,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}
