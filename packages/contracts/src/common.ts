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

/**
 * A user-typed amount in major units, e.g. "1500" or "1,500.50". Forms validate
 * with this and convert with `majorToMinor` before calling the API.
 */
export const AmountMajorInput = z
  .string()
  .trim()
  .min(1, "Enter an amount")
  .regex(/^(\d+|\d{1,3}(,\d{3})+)(\.\d{1,2})?$/, "Enter a valid amount, e.g. 1,500.50")
  // zod runs refinements even after a failed check, so this must not throw.
  .refine((v) => Number(v.replace(/,/g, "")) > 0, "Amount must be greater than zero");

/** A single field-level validation error, as emitted by the backend. */
export const FieldError = z.object({
  field: z.string(),
  message: z.string(),
});
export type FieldError = z.infer<typeof FieldError>;

export const IsoDateTime = z.string();
