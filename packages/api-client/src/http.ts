import type { FieldError } from "@irate/contracts";
import { ApiError } from "./errors";

/**
 * Minimal structural shape of a Zod schema — lets us validate without importing
 * Zod's types into the hot path. Any `z.ZodType` satisfies this.
 */
export interface ResponseSchema {
  safeParse(data: unknown): { success: boolean; data?: unknown; error?: { issues?: unknown } };
}

const isProd = process.env.NODE_ENV === "production";

/**
 * Validate a response payload against a schema. On mismatch we **warn loudly in
 * development** (so contract drift surfaces immediately) but **pass the data
 * through in production** — a backend shape change shouldn't hard-crash the UI;
 * it should be visible in logs and caught in CI/dev first.
 */
export function validateResponse(
  data: unknown,
  schema: ResponseSchema | undefined,
  label: string,
): unknown {
  if (!schema) return data;
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  if (!isProd && typeof console !== "undefined") {
    // eslint-disable-next-line no-console
    console.warn(`[api] response shape mismatch for "${label}"`, result.error?.issues);
  }
  return data;
}

export interface HttpRequestOptions {
  /** Query params appended to the URL (undefined/null values are skipped). */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Extra headers. */
  headers?: Record<string, string>;
  /** Provide an explicit idempotency key for a mutation (else one is generated). */
  idempotencyKey?: string;
  /** Abort signal for cancellation (wired to React Query). */
  signal?: AbortSignal;
  /** Per-request timeout in ms (defaults to client config). */
  timeoutMs?: number;
  /** Validate the response payload against this schema (see `validateResponse`). */
  schema?: ResponseSchema;
  /** Label used in validation warnings (defaults to the path). */
  schemaLabel?: string;
}

export interface HttpClientConfig {
  /**
   * Base URL. In the browser this is "" (same-origin → the BFF proxy).
   * On the server (BFF) this is the real backend origin + /api/v1.
   */
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
  /** Whether to send cookies (always true in the browser for the BFF). */
  withCredentials?: boolean;
  /** Called once when a request returns 401 — apps redirect to login here. */
  onUnauthorized?: () => void;
  /** Inject auth header (used by the server-side BFF client). */
  getAuthHeader?: () => Record<string, string> | undefined;
}

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Deterministic-enough fallback for non-crypto environments.
  return `idemp-${Date.now()}-${Math.round(performance?.now?.() ?? 0)}`;
}

/**
 * Minimal, dependency-free HTTP client over `fetch`.
 *
 * - Unwraps the backend `{ success, message, data }` envelope and returns `data`.
 * - Normalizes errors into {@link ApiError} (status, code, field errors).
 * - Adds an `Idempotency-Key` to every mutating request (required by transfers).
 * - Works in the browser (same-origin BFF) and on the server (BFF → backend).
 */
export class HttpClient {
  private readonly config: Required<
    Pick<HttpClientConfig, "baseUrl" | "timeoutMs" | "withCredentials">
  > &
    HttpClientConfig;

  constructor(config: HttpClientConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl ?? "",
      timeoutMs: config.timeoutMs ?? 30_000,
      withCredentials: config.withCredentials ?? true,
      ...config,
    };
  }

  get<T>(path: string, options?: HttpRequestOptions) {
    return this.request<T>("GET", path, undefined, options);
  }
  post<T>(path: string, body?: unknown, options?: HttpRequestOptions) {
    return this.request<T>("POST", path, body, options);
  }
  put<T>(path: string, body?: unknown, options?: HttpRequestOptions) {
    return this.request<T>("PUT", path, body, options);
  }
  patch<T>(path: string, body?: unknown, options?: HttpRequestOptions) {
    return this.request<T>("PATCH", path, body, options);
  }
  delete<T>(path: string, options?: HttpRequestOptions) {
    return this.request<T>("DELETE", path, undefined, options);
  }

  private buildUrl(path: string, params?: HttpRequestOptions["params"]): string {
    const base = this.config.baseUrl.replace(/\/$/, "");
    const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
    if (!params) return url;
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) qs.append(key, String(value));
    }
    const query = qs.toString();
    return query ? `${url}?${query}` : url;
  }

  private async request<T>(
    method: string,
    path: string,
    body: unknown,
    options: HttpRequestOptions = {},
  ): Promise<T> {
    const url = this.buildUrl(path, options.params);
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...this.config.defaultHeaders,
      ...this.config.getAuthHeader?.(),
      ...options.headers,
    };

    if (body !== undefined && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    if (MUTATING.has(method)) {
      headers["Idempotency-Key"] = options.idempotencyKey ?? generateIdempotencyKey();
    }

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      options.timeoutMs ?? this.config.timeoutMs,
    );
    if (options.signal) {
      options.signal.addEventListener("abort", () => controller.abort(), { once: true });
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body:
          body === undefined
            ? undefined
            : body instanceof FormData
              ? body
              : JSON.stringify(body),
        credentials: this.config.withCredentials ? "include" : "same-origin",
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      const aborted = err instanceof DOMException && err.name === "AbortError";
      throw new ApiError({
        status: 0,
        message: aborted
          ? "The request timed out. Please try again."
          : "Network error. Please check your connection.",
        code: aborted ? "TIMEOUT" : "NETWORK_ERROR",
      });
    }
    clearTimeout(timeout);

    const data = await this.parse<T>(response);
    return validateResponse(
      data,
      options.schema,
      options.schemaLabel ?? `${method} ${path}`,
    ) as T;
  }

  private async parse<T>(response: Response): Promise<T> {
    const text = await response.text();
    let payload: unknown = undefined;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = undefined;
      }
    }

    const envelope = payload as
      | { success?: boolean; message?: string; data?: T; code?: string; errors?: FieldError[] }
      | undefined;

    if (!response.ok) {
      if (response.status === 401) this.config.onUnauthorized?.();
      throw new ApiError({
        status: response.status,
        message: envelope?.message || response.statusText || "Request failed",
        code: envelope?.code,
        fieldErrors: envelope?.errors,
      });
    }

    // Successful responses unwrap `data`; tolerate bare payloads too.
    if (envelope && typeof envelope === "object" && "data" in envelope) {
      return envelope.data as T;
    }
    return payload as T;
  }
}
