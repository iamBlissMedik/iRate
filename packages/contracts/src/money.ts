/**
 * Money helpers. The backend stores and returns money in **minor units**
 * (kobo for NGN; 1 NGN = 100 kobo) as strings. These helpers convert and format
 * for display without ever using floating-point math on the raw value.
 */

const MINOR_PER_MAJOR = 100n;

export type MinorUnits = string | number | bigint;

function toBigInt(value: MinorUnits): bigint {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") {
    if (!Number.isInteger(value)) {
      throw new Error(`Minor-unit amount must be an integer, got ${value}`);
    }
    return BigInt(value);
  }
  return BigInt(value);
}

/** Convert minor units to a major-unit number (for charts/aggregations only). */
export function minorToMajorNumber(value: MinorUnits): number {
  const minor = toBigInt(value);
  return Number(minor) / 100;
}

/**
 * Format minor units as a localized currency string, e.g. "₦48,000.00".
 * Defaults to NGN. Uses exact integer math for the major/minor split.
 */
export function formatMoney(
  value: MinorUnits,
  options: { currency?: string; locale?: string; showSymbol?: boolean } = {},
): string {
  const { currency = "NGN", locale = "en-NG", showSymbol = true } = options;
  const minor = toBigInt(value);
  const negative = minor < 0n;
  const abs = negative ? -minor : minor;

  const major = abs / MINOR_PER_MAJOR;
  const remainder = abs % MINOR_PER_MAJOR;

  // Group the integer part from the BigInt directly — exact at any magnitude,
  // unlike Number which loses precision past 2^53.
  const majorGrouped = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(major);
  const cents = remainder.toString().padStart(2, "0");

  const symbol = showSymbol ? currencySymbol(locale, currency) : "";
  return `${negative ? "-" : ""}${symbol}${majorGrouped}.${cents}`;
}

function currencySymbol(locale: string, currency: string): string {
  const part = new Intl.NumberFormat(locale, { style: "currency", currency })
    .formatToParts(0)
    .find((p) => p.type === "currency");
  return part?.value ?? "";
}

/** Convert a user-entered major-unit string/number to integer minor units. */
export function majorToMinor(value: string | number): number {
  const n = typeof value === "string" ? Number(value.replace(/,/g, "")) : value;
  if (!Number.isFinite(n)) throw new Error(`Invalid money input: ${value}`);
  return Math.round(n * 100);
}

/** Mask an account number for display, e.g. "100000••89". */
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  const head = accountNumber.slice(0, 4);
  const tail = accountNumber.slice(-2);
  return `${head}${"•".repeat(Math.max(2, accountNumber.length - 6))}${tail}`;
}
