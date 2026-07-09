import { z } from "zod";

/** Roles mirror the backend `UserRole` enum. */
export const UserRole = z.enum(["ADMIN", "USER"]);
export type UserRole = z.infer<typeof UserRole>;

export const TransactionType = z.enum(["CREDIT", "DEBIT"]);
export type TransactionType = z.infer<typeof TransactionType>;

/** Direction of a transaction relative to the viewing user's wallet. */
export const TransactionDirection = z.enum(["in", "out"]);
export type TransactionDirection = z.infer<typeof TransactionDirection>;

export const LedgerType = z.enum(["CREDIT", "DEBIT", "FEE", "ADJUSTMENT"]);
export type LedgerType = z.infer<typeof LedgerType>;

export const KYCStatus = z.enum(["PENDING", "VERIFIED", "REJECTED"]);
export type KYCStatus = z.infer<typeof KYCStatus>;

/** Accepted government ID types for KYC submission. */
export const KYCIdType = z.enum(["NIN", "BVN", "PASSPORT", "DRIVERS_LICENSE", "VOTERS_CARD"]);
export type KYCIdType = z.infer<typeof KYCIdType>;
