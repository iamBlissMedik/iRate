import type { AdminKycQuery, AdminUsersQuery } from "@irate/contracts";

/**
 * Centralized React Query key factory. Hierarchical keys make targeted
 * invalidation easy (e.g. invalidate `qk.wallet.all` after a transfer).
 */
export const qk = {
  session: ["session"] as const,

  user: {
    all: ["user"] as const,
    me: ["user", "me"] as const,
    overview: ["user", "overview"] as const,
    byId: (id: string) => ["user", "byId", id] as const,
  },

  wallet: {
    all: ["wallet"] as const,
    list: ["wallet", "list"] as const,
    balance: (walletId: string) => ["wallet", "balance", walletId] as const,
  },

  transaction: {
    all: ["transaction"] as const,
    me: ["transaction", "me"] as const,
    forWallet: (walletId: string, page?: number, limit?: number) =>
      ["transaction", "wallet", walletId, { page, limit }] as const,
    resolve: (accountNumber: string) => ["transaction", "resolve", accountNumber] as const,
  },

  kyc: {
    all: ["kyc"] as const,
    status: ["kyc", "status"] as const,
  },

  admin: {
    all: ["admin"] as const,
    overview: ["admin", "overview"] as const,
    me: ["admin", "me"] as const,
    userStats: ["admin", "userStats"] as const,
    walletsBalance: ["admin", "walletsBalance"] as const,
    users: (query: AdminUsersQuery) => ["admin", "users", query] as const,
    kyc: (query: AdminKycQuery) => ["admin", "kyc", query] as const,
  },
} as const;
