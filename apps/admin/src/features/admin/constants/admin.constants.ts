/**
 * Admin Feature Constants
 *
 * Constants and configuration for admin feature
 */

export const ADMIN_CONFIG = {
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    usersLimit: 20,
    kycsLimit: 15,
    walletsLimit: 20,
  },
  refresh: {
    dashboardInterval: 5 * 60 * 1000, // 5 minutes
    usersInterval: 2 * 60 * 1000, // 2 minutes
    kycInterval: 1 * 60 * 1000, // 1 minute
    walletsInterval: 2 * 60 * 1000, // 2 minutes
  },
  roles: {
    ADMIN: "ADMIN",
    USER: "USER",
  } as const,
  kycStatuses: {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    NOT_SUBMITTED: "NOT_SUBMITTED",
  } as const,
};

export const KYC_STATUS_COLORS = {
  APPROVED: "green",
  PENDING: "yellow",
  REJECTED: "red",
  NOT_SUBMITTED: "gray",
} as const;

export const USER_ROLE_LABELS = {
  ADMIN: "Administrator",
  USER: "User",
} as const;

export const ADMIN_ROUTES = {
  dashboard: "/admin/dashboard",
  users: "/admin/users",
  kyc: "/admin/kyc",
  wallets: "/admin/wallets",
  transactions: "/admin/transactions",
  settings: "/admin/settings",
} as const;
