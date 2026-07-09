import { z } from "zod";

/**
 * Monetary values are integer **minor units** (kobo / cents) and are returned by
 * the API as strings because JSON has no BigInt. Clients divide by 100 to display.
 * See the backend README "Money: minor units".
 */
export const MoneyMinor = z
  .string()
  .regex(/^-?\d+$/, "Expected an integer minor-unit amount as a string");
export type MoneyMinor = z.infer<typeof MoneyMinor>;

/** Amounts sent in request bodies are positive integers in minor units. */
export const AmountMinorInput = z
  .number()
  .int("Amount must be a whole number of minor units")
  .positive("Amount must be greater than zero");

/** A single field-level validation error, as emitted by the backend. */
export const FieldError = z.object({
  field: z.string(),
  message: z.string(),
});
export type FieldError = z.infer<typeof FieldError>;

/**
 * Every backend response uses the `{ success, message, data }` envelope.
 * Build a typed schema for a given `data` payload.
 */
export function apiResponse<T extends z.ZodTypeAny>(data: T) {
  return z.object({
    success: z.boolean(),
    message: z.string(),
    data,
  });
}

/** The error envelope returned for non-2xx responses. */
export const ApiErrorEnvelope = z.object({
  success: z.literal(false),
  message: z.string(),
  code: z.string().optional(),
  errors: z.array(FieldError).optional(),
});
export type ApiErrorEnvelope = z.infer<typeof ApiErrorEnvelope>;

/** Generic envelope type (runtime-agnostic) for use in client generics. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/** Pagination request params shared by list endpoints. */
export const PaginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationQuery = z.infer<typeof PaginationQuery>;

/** Wrap a row schema into a paginated list payload. */
export function paginated<T extends z.ZodTypeAny>(row: T) {
  return z.object({
    items: z.array(row),
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  });
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const IsoDateTime = z.string();
