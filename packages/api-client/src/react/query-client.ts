import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { ApiError } from "../errors";

export interface CreateQueryClientOptions {
  /** Global error sink — apps wire this to a toast. Receives a friendly message. */
  onError?: (message: string, error: unknown) => void;
  /** Invoked when any request resolves as 401 (session truly invalid). */
  onUnauthorized?: () => void;
}

/**
 * Build a QueryClient with fintech-appropriate defaults:
 * - never retry on auth/validation errors (4xx); retry transient 5xx/network twice
 * - refetch balances on window focus & reconnect (money should be fresh)
 * - centralized error toasts via QueryCache/MutationCache
 */
export function createQueryClient(options: CreateQueryClientOptions = {}): QueryClient {
  const handle = (error: unknown) => {
    if (error instanceof ApiError && error.isUnauthorized) {
      options.onUnauthorized?.();
      return;
    }
    const message =
      error instanceof Error ? error.message : "Something went wrong. Please try again.";
    // Observability seam: one central place to forward errors to a tracker
    // (Sentry/Datadog). Today it logs; swap for `captureException(error)`.
    if (typeof console !== "undefined") console.error("[query error]", error);
    options.onError?.(message, error);
  };

  return new QueryClient({
    queryCache: new QueryCache({ onError: handle }),
    mutationCache: new MutationCache({ onError: handle }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: (failureCount, error) => {
          if (error instanceof ApiError) {
            if (error.status >= 400 && error.status < 500) return false;
          }
          return failureCount < 2;
        },
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      },
      mutations: {
        retry: false,
      },
    },
  });
}
