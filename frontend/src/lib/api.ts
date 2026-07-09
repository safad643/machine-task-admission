import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

function toApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    const statusCode = error.response?.status ?? 500;

    if (data && typeof data === "object" && "message" in data) {
      const message = Array.isArray(data.message)
        ? data.message.join("; ")
        : String(data.message);
      return {
        message,
        statusCode,
        error: "error" in data ? String(data.error) : undefined,
      };
    }

    return {
      message: error.message || "Something went wrong",
      statusCode,
    };
  }

  if (error instanceof Error) {
    return { message: error.message, statusCode: 500 };
  }

  return { message: "Something went wrong", statusCode: 500 };
}

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error))
);
