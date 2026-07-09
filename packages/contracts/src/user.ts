import { z } from "zod";
import { IsoDateTime, MoneyMinor } from "./common";
import { UserRole, KYCStatus } from "./enums";
import { walletSchema } from "./wallet";
import { transactionEntrySchema } from "./transaction";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: UserRole,
  createdAt: IsoDateTime.optional(),
  updatedAt: IsoDateTime.optional(),
  wallets: z.array(walletSchema).optional(),
  kycStatus: KYCStatus.optional(),
});
export type User = z.infer<typeof userSchema>;

/**
 * `GET /users/me/overview` — the home/dashboard payload. Shape verified against
 * the backend `getMyOverview`: account number, balance, KYC status (nullable),
 * headline stats, and `recentTransactions` (enriched).
 */
export const userOverviewSchema = z.object({
  accountNumber: z.string(),
  balance: MoneyMinor,
  currency: z.string().default("NGN"),
  kycStatus: KYCStatus.nullable(),
  stats: z
    .object({
      totalIn: MoneyMinor.optional(),
      totalOut: MoneyMinor.optional(),
      transactionCount: z.number().int().optional(),
    })
    .partial()
    .optional(),
  recentTransactions: z.array(transactionEntrySchema).default([]),
});
export type UserOverview = z.infer<typeof userOverviewSchema>;
