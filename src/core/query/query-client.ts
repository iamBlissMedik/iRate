import { QueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

/**
 * React Query Client Configuration
 *
 * Centralized configuration for data fetching, caching, and synchronization
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: How long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes

      // GC time: How long unused data stays in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Retry failed requests
      retry: (failureCount, error: Error) => {
        // Don't retry on 4xx errors (client errors)
        if (
          "statusCode" in error &&
          typeof error.statusCode === "number" &&
          error.statusCode >= 400 &&
          error.statusCode < 500
        ) {
          return false;
        }
        // Retry up to 2 times for 5xx and network errors
        return failureCount < 2;
      },

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Don't refetch on window focus by default (can be overridden per query)
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: true,

      // Refetch on mount if data is stale
      refetchOnMount: true,
    },

    mutations: {
      // Retry failed mutations once
      retry: 1,

      // Global mutation error handler
      onError: (error: Error) => {
        const message =
          "message" in error && typeof error.message === "string"
            ? error.message
            : "An error occurred";
        toast.error(message);
      },
    },
  },
});

/**
 * Query key factory
 *
 * Centralized query keys for consistent cache management
 * Prevents typos and makes refactoring easier
 */
export const queryKeys = {
  // Auth keys
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },

  // User keys
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Wallet keys
  wallets: {
    all: ["wallets"] as const,
    lists: () => [...queryKeys.wallets.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.wallets.lists(), filters] as const,
    details: () => [...queryKeys.wallets.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.wallets.details(), id] as const,
    balance: (id: string) =>
      [...queryKeys.wallets.detail(id), "balance"] as const,
    transactions: (id: string, page?: number) =>
      [...queryKeys.wallets.detail(id), "transactions", page] as const,
  },

  // Transaction keys
  transactions: {
    all: ["transactions"] as const,
    lists: () => [...queryKeys.transactions.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.transactions.lists(), filters] as const,
    details: () => [...queryKeys.transactions.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.transactions.details(), id] as const,
  },

  // KYC keys
  kyc: {
    all: ["kyc"] as const,
    status: () => [...queryKeys.kyc.all, "status"] as const,
    detail: (userId: string) => [...queryKeys.kyc.all, userId] as const,
  },

  // Admin keys
  admin: {
    all: ["admin"] as const,
    me: () => [...queryKeys.admin.all, "me"] as const,
    users: (filters?: Record<string, unknown>) =>
      [...queryKeys.admin.all, "users", filters] as const,
    stats: () => [...queryKeys.admin.all, "stats"] as const,
  },
} as const;

/**
 * Mutation keys (for tracking loading states)
 */
export const mutationKeys = {
  auth: {
    login: "auth.login",
    register: "auth.register",
    logout: "auth.logout",
    refresh: "auth.refresh",
  },
  wallet: {
    create: "wallet.create",
    transfer: "wallet.transfer",
    delete: "wallet.delete",
  },
  transaction: {
    create: "transaction.create",
    reverse: "transaction.reverse",
  },
  kyc: {
    submit: "kyc.submit",
    verify: "kyc.verify",
  },
} as const;
