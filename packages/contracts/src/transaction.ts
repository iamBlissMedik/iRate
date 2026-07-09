import { z } from "zod";
import { AmountMinorInput, IsoDateTime, MoneyMinor } from "./common";
import { TransactionDirection, TransactionType } from "./enums";

/** A 10-digit NUBAN-style account number. */
export const accountNumberSchema = z
  .string()
  .regex(/^\d{10}$/, "Account number must be 10 digits");

/** Name-enquiry result — never leaks email or balance. (Backend key: `accountName`.) */
export const resolveAccountSchema = z.object({
  accountNumber: accountNumberSchema,
  accountName: z.string(),
});
export type ResolvedAccount = z.infer<typeof resolveAccountSchema>;

/** Counterparty on a transaction history entry (name may be unresolved → null). */
export const counterpartySchema = z.object({
  accountNumber: z.string(),
  name: z.string().nullable(),
});
export type Counterparty = z.infer<typeof counterpartySchema>;

/**
 * Enriched transaction history entry — reads like a bank statement.
 * Matches the backend `GET /transactions/me` shape.
 */
export const transactionEntrySchema = z.object({
  id: z.string(),
  type: TransactionType,
  direction: TransactionDirection,
  amount: MoneyMinor,
  description: z.string(),
  counterparty: counterpartySchema.nullable().optional(),
  balanceAfter: MoneyMinor.optional(),
  createdAt: IsoDateTime,
});
export type TransactionEntry = z.infer<typeof transactionEntrySchema>;

export const transactionListSchema = z.array(transactionEntrySchema);

/** Backend pagination meta (shared by transaction/wallet list endpoints). */
export const pageMetaSchema = z.object({
  total: z.number().int(),
  page: z.number().int().optional(),
  limit: z.number().int().optional(),
  totalPages: z.number().int().optional(),
  hasNextPage: z.boolean().optional(),
  hasPrevPage: z.boolean().optional(),
});
export type PageMeta = z.infer<typeof pageMetaSchema>;

/** `GET /transactions/me` and `/transactions/:walletId/transactions` envelope. */
export const transactionPageSchema = z.object({
  transactions: z.array(transactionEntrySchema),
  pagination: pageMetaSchema.optional(),
  total: z.number().int().optional(),
});
export type TransactionPage = z.infer<typeof transactionPageSchema>;

/** Transfer request. The `Idempotency-Key` header is added by the client. */
export const transferSchema = z.object({
  toAccountNumber: accountNumberSchema,
  amount: AmountMinorInput,
  note: z.string().max(140).optional(),
});
export type TransferInput = z.infer<typeof transferSchema>;

export const transferResultSchema = z.object({
  id: z.string(),
  type: TransactionType,
  amount: MoneyMinor,
  balanceAfter: MoneyMinor.optional(),
  createdAt: IsoDateTime,
});
export type TransferResult = z.infer<typeof transferResultSchema>;
