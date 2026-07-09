import type { FieldError } from "@irate/contracts";

/**
 * Normalized API error thrown by the HttpClient. Carries the HTTP status, an
 * optional machine-readable `code`, and any field-level validation errors so
 * forms can map them back onto inputs.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors?: FieldError[];

  constructor(params: {
    status: number;
    message: string;
    code?: string;
    fieldErrors?: FieldError[];
  }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.code = params.code;
    this.fieldErrors = params.fieldErrors;
  }

  get isUnauthorized() {
    return this.status === 401;
  }
  get isForbidden() {
    return this.status === 403;
  }
  get isValidation() {
    return this.status === 422 || (this.fieldErrors?.length ?? 0) > 0;
  }
  get isNetwork() {
    return this.status === 0;
  }
  get isServer() {
    return this.status >= 500;
  }

  /** Map field errors into a `{ field: message }` record for react-hook-form. */
  toFieldRecord(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const fe of this.fieldErrors ?? []) out[fe.field] = fe.message;
    return out;
  }
}

/** Extract a user-friendly message from any thrown value (for toasts). */
export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof ApiError) return error.message || fallback;
  if (error instanceof Error) return error.message || fallback;
  if (typeof error === "string") return error;
  return fallback;
}
