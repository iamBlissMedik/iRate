/**
 * Common shared types used across the application
 */

/**
 * User roles
 */
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

/**
 * Transaction types
 */
export enum TransactionType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

/**
 * Transaction status
 */
export enum TransactionStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REVERSED = "REVERSED",
}

/**
 * KYC status
 */
export enum KYCStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

/**
 * Generic ID type
 */
export type ID = string;

/**
 * Timestamp type
 */
export type Timestamp = string; // ISO 8601 format

/**
 * Money amount (in NGN)
 */
export type Money = number;

/**
 * Nullable type
 */
export type Nullable<T> = T | null;

/**
 * Optional type
 */
export type Optional<T> = T | undefined;

/**
 * Async state wrapper
 */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Base entity interface
 */
export interface BaseEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
