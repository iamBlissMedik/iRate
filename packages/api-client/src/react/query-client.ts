import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError, getErrorMessage } from "../errors";

export interface CreateQueryClientOptions {
  /** Called with a friendly message when a query fails — apps show a toast. */
  onError?: (message: string, error: unknown) => void;
  /** Called when any request returns 401 (the BFF could not refresh the session). */
  onUnauthorized?: () => void;
}

const isUnauthorized = (error: unknown) => error instanceof ApiError && error.isUnauthorized;

/**
 * Build a QueryClient with fintech-appropriate defaults:
 * - never retry 4xx; retry transient 5xx/network failures twice with backoff
 * - refetch on window focus & reconnect (balances should be fresh)
 * - a 401 anywhere triggers `onUnauthorized`
 * - failed queries report through `onError`; failed mutations do not — the
 *   form that fired them shows the error in context (field errors or a toast)
 */
export function createQueryClient(options: CreateQueryClientOptions = {}): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (isUnauthorized(error)) return options.onUnauthorized?.();
        // Observability seam: forward to an error tracker (Sentry, Datadog) here.
        console.error("[query error]", error);
        options.onError?.(getErrorMessage(error), error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (isUnauthorized(error)) options.onUnauthorized?.();
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
          return failureCount < 2;
        },
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      },
      mutations: { retry: false },
    },
  });
}
