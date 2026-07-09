import { z } from "zod";
import { IsoDateTime, MoneyMinor } from "./common";

export const walletSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  accountNumber: z.string().optional(),
  balance: MoneyMinor,
  currency: z.string().default("NGN"),
  createdAt: IsoDateTime.optional(),
});
export type Wallet = z.infer<typeof walletSchema>;

export const walletListSchema = z.array(walletSchema);

/** `GET /wallets` envelope: `{ wallets, pagination }`. */
export const walletPageSchema = z.object({
  wallets: z.array(walletSchema),
  pagination: z
    .object({
      total: z.number().int(),
      page: z.number().int().optional(),
      limit: z.number().int().optional(),
      totalPages: z.number().int().optional(),
    })
    .optional(),
});
export type WalletPage = z.infer<typeof walletPageSchema>;

export const walletBalanceSchema = z.object({
  walletId: z.string(),
  balance: MoneyMinor,
  currency: z.string().default("NGN"),
});
export type WalletBalance = z.infer<typeof walletBalanceSchema>;

export const createWalletSchema = z.object({
  currency: z.string().default("NGN"),
});
export type CreateWalletInput = z.infer<typeof createWalletSchema>;
