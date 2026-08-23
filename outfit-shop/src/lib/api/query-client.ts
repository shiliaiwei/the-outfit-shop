// NOTE: Requires @tanstack/react-query to be installed
import { QueryClient } from "@tanstack/react-query";
import { AppError } from "./errors";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime:          60_000,
        gcTime:             5 * 60_000,
        refetchOnWindowFocus: process.env.NODE_ENV === "production",
        refetchOnReconnect: true,
        retry(failureCount: number, error: any) {
          const code = (error as AppError)?.code;
          if (["FORBIDDEN","UNAUTHENTICATED","VALIDATION","NOT_FOUND"].includes(String(code))) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
