import { z } from "zod";
import { AppError, AppErrorCode } from "./errors";

const IS_SERVER = typeof window === "undefined";
const DEFAULT_API_URL = "https://api.kesararamwithdigital.tech/api/v1";

export const API_BASE = IS_SERVER
  ? (process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_URL)
  : "/api/v1";

// ── Standard API Envelope ──
export function ApiEnvelope<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data:    dataSchema,
    message: z.string().optional(),
    meta:    z
      .object({
        page:     z.number(),
        per_page: z.number(),
        total:    z.number(),
      })
      .partial()
      .optional(),
  });
}

export type ApiEnvelopeType<T> = z.infer<ReturnType<typeof ApiEnvelope<z.ZodType<T>>>>;

// ── Cookie token getter ──
export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/outfit_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]!) : null;
}

// ── Fetch Wrapper mimicking Axios interceptors ──
async function request<T>(
  path: string,
  options: RequestInit & { params?: Record<string, any> } = {}
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("X-App", "OutfitShop/1.0");

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let url = `${API_BASE}${path}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const status = response.status;
      let rawData: any;
      try {
        rawData = await response.json();
      } catch (e) {
        rawData = {};
      }

      let code: AppErrorCode = "UNKNOWN";
      let message = rawData?.message || response.statusText;
      let fieldErrors: Record<string, string[]> | undefined;

      switch (status) {
        case 401: {
          code = "UNAUTHENTICATED";
          const isLoginRequest = path.includes("/auth/login");
          message = isLoginRequest ? "Invalid username or password." : "Session expired or unauthenticated.";
          break;
        }
        case 403:
          code = "FORBIDDEN";
          message = "Your role does not grant access to this feature. Contact an admin.";
          break;
        case 404:
          code = "NOT_FOUND";
          message = rawData?.message || "Resource not found.";
          break;
        case 422:
          code = "VALIDATION";
          message = rawData?.message || "Please correct the highlighted fields.";
          fieldErrors = rawData?.errors as Record<string, string[]> | undefined;
          break;
        case 429:
          code = "RATELIMITED";
          message = `Too many requests — retry after ${response.headers.get("retry-after") || "30s"}.`;
          break;
        default:
          if (status >= 500) {
            code = "SERVER";
            message = "Server error — our team has been alerted.";
          }
      }
      throw new AppError(code, message, { status, fieldErrors });
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AppError) throw error;

    // Network errors
    throw new AppError("NETWORK", "No internet connection or server unreachable.");
  }
}

export const api = {
  get: <T>(path: string, options?: RequestInit & { params?: Record<string, any> }) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body: any, options?: RequestInit & { params?: Record<string, any> }) =>
    request<T>(path, { ...options, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: <T>(path: string, body: any, options?: RequestInit & { params?: Record<string, any> }) =>
    request<T>(path, { ...options, method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: <T>(path: string, body: any, options?: RequestInit & { params?: Record<string, any> }) =>
    request<T>(path, { ...options, method: "PATCH", body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: <T>(path: string, options?: RequestInit & { params?: Record<string, any> }) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
