import { z } from "zod";
import { AmountMinorInput, IsoDateTime, MoneyMinor } from "./common";
import { KYCStatus, UserRole } from "./enums";

/**
 * NOTE: these schemas mirror the **real** backend responses (see
 * irate-backend `modules/{user,wallet,kyc,transaction,admin}`). List endpoints
 * return `{ <rows>, pagination }`; stat endpoints return a `{ title, value,
 * trend, trendType }` card; money values are minor-unit strings.
 */

/** Pagination meta returned by every paginated admin list. */
export const adminPaginationSchema = z.object({
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
  totalPages: z.number().int(),
  hasNextPage: z.boolean().optional(),
  hasPrevPage: z.boolean().optional(),
});
export type AdminPagination = z.infer<typeof adminPaginationSchema>;

export const trendType = z.enum(["up", "down", "neutral"]);
export type TrendType = z.infer<typeof trendType>;

/** Headline stat card. `value` is a count (number) or money (minor string). */
export const adminStatCardSchema = z.object({
  title: z.string(),
  value: z.union([z.number(), MoneyMinor]),
  trend: z.number().optional(),
  trendType: trendType.optional(),
  currency: z.string().optional(),
  wallets: z.number().int().optional(),
  credit: MoneyMinor.optional(),
  debit: MoneyMinor.optional(),
});
export type AdminStatCard = z.infer<typeof adminStatCardSchema>;

/* ------------------------------------------------------- Dashboard overview */

/** `GET /admin/dashboard/overview` — aggregated, nested stat cards. */
export const adminOverviewSchema = z.object({
  usersStats: adminStatCardSchema,
  walletsBalance: adminStatCardSchema,
  transactionStats: adminStatCardSchema,
  totalCashflow: adminStatCardSchema,
  transactionVolume: adminStatCardSchema,
});
export type AdminOverview = z.infer<typeof adminOverviewSchema>;

/* -------------------------------------------------------------------- Users */

export const adminUserKycSchema = z
  .object({
    id: z.string(),
    status: KYCStatus,
    verifiedAt: IsoDateTime.nullable().optional(),
  })
  .nullable();

export const adminUserWalletSchema = z.object({
  id: z.string(),
  balance: MoneyMinor,
  createdAt: IsoDateTime.optional(),
});

export const adminUserRowSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: UserRole,
  createdAt: IsoDateTime.optional(),
  kyc: adminUserKycSchema.optional(),
  wallets: z.array(adminUserWalletSchema).default([]),
});
export type AdminUserRow = z.infer<typeof adminUserRowSchema>;

export const adminUsersResponseSchema = z.object({
  users: z.array(adminUserRowSchema),
  pagination: adminPaginationSchema,
});
export type AdminUsersResponse = z.infer<typeof adminUsersResponseSchema>;

export const adminUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});
export type AdminUsersQuery = z.infer<typeof adminUsersQuerySchema>;

/** `GET /admin/users/stats` */
export const adminUserStatsSchema = adminStatCardSchema;
export type AdminUserStats = z.infer<typeof adminUserStatsSchema>;

/* ------------------------------------------------------------------ Wallets */

/** `GET /admin/wallets/balance` — aggregate only (no per-wallet list). */
export const adminWalletsBalanceSchema = z.object({
  title: z.string().optional(),
  value: MoneyMinor,
  currency: z.string().default("NGN"),
  wallets: z.number().int().optional(),
  trend: z.number().optional(),
  trendType: trendType.optional(),
});
export type AdminWalletsBalance = z.infer<typeof adminWalletsBalanceSchema>;

/** `POST /admin/credit/:walletId` — both fields required by the backend. */
export const creditWalletSchema = z.object({
  amount: AmountMinorInput,
  reason: z.string().trim().min(1, "Reason is required").max(200),
});
export type CreditWalletInput = z.infer<typeof creditWalletSchema>;

export const creditResultSchema = z
  .object({
    walletId: z.string().optional(),
    balance: MoneyMinor.optional(),
    newBalance: MoneyMinor.optional(),
    transactionId: z.string().optional(),
  })
  .passthrough();
export type CreditResult = z.infer<typeof creditResultSchema>;

/* --------------------------------------------------------------------- KYC */

export const adminKycRowSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fullName: z.string(),
  dateOfBirth: IsoDateTime,
  address: z.string(),
  idType: z.string(),
  idNumber: z.string(),
  documentUrl: z.string().nullable().optional(),
  status: KYCStatus,
  verifiedAt: IsoDateTime.nullable().optional(),
  createdAt: IsoDateTime.optional(),
  updatedAt: IsoDateTime.optional(),
  user: z
    .object({ id: z.string(), email: z.string(), role: UserRole })
    .optional(),
});
export type AdminKycRow = z.infer<typeof adminKycRowSchema>;

export const adminKycResponseSchema = z.object({
  kycs: z.array(adminKycRowSchema),
  pagination: adminPaginationSchema,
});
export type AdminKycResponse = z.infer<typeof adminKycResponseSchema>;

export const adminKycQuerySchema = z.object({
  status: KYCStatus.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
export type AdminKycQuery = z.infer<typeof adminKycQuerySchema>;

/** `PATCH /admin/kyc/:kycId/review` — backend expects `{ action }`. */
export const kycReviewSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
});
export type KYCReviewInput = z.infer<typeof kycReviewSchema>;
