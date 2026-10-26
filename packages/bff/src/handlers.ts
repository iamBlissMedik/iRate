import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@irate/contracts";
import { callBackend, extractAccessToken, refreshSession } from "./backend";
import { clientIpHeaders } from "./client-ip";
import { clearAuthCookies, readAuthCookies, setAuthCookies } from "./cookies";
import { sessionUserFromToken } from "./jwt";
import { applySession, isRejected, resolveSession } from "./session";

export interface LoginHandlerOptions {
  /** Restrict who may obtain a session here (e.g. ["ADMIN"] for the admin app). */
  allowedRoles?: UserRole[];
}

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

const ok = (data: unknown, message = "OK") => json({ success: true, message, data });

const fail = (status: number, message: string, extra?: Record<string, unknown>) =>
  json({ success: false, message, ...extra }, status);

/* ------------------------------------------------------------- POST /login */

export function createLoginHandler(options: LoginHandlerOptions = {}) {
  return async function POST(req: NextRequest) {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return fail(400, "Invalid request body");
    }

    // Forward the browser's IP so the API's per-IP login limit is per customer,
    // not one budget shared by everyone behind the BFF.
    const result = await callBackend("/auth/login", {
      method: "POST",
      body,
      headers: clientIpHeaders(req.headers),
    });
    if (!result.ok) {
      return json(result.body ?? { success: false, message: "Login failed" }, result.status);
    }

    const accessToken = extractAccessToken(result.body);
    if (!accessToken) return fail(502, "Auth service did not return a token");

    const user = sessionUserFromToken(accessToken);

    // Role gate (defense in depth — also enforced in the proxy). Never set a
    // cookie for a disallowed role.
    if (options.allowedRoles && (!user || !options.allowedRoles.includes(user.role))) {
      return fail(403, "You do not have access to this application.");
    }

    const store = await cookies();
    setAuthCookies(store, { accessToken, refreshToken: result.refreshToken });

    return ok({ user }, "Signed in");
  };
}

/* ---------------------------------------------------------- POST /register */

export function createRegisterHandler() {
  return async function POST(req: NextRequest) {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return fail(400, "Invalid request body");
    }

    const result = await callBackend("/auth/register", {
      method: "POST",
      body,
      headers: clientIpHeaders(req.headers),
    });
    if (!result.ok) {
      return json(result.body ?? { success: false, message: "Registration failed" }, result.status);
    }

    // If the backend also returns a session on register, persist it.
    const accessToken = extractAccessToken(result.body);
    if (accessToken) {
      const store = await cookies();
      setAuthCookies(store, { accessToken, refreshToken: result.refreshToken });
    }

    const data = (result.body as { data?: unknown })?.data ?? result.body;
    return ok(data, "Account created");
  };
}

/* ------------------------------------------------------------ POST /logout */

export function createLogoutHandler() {
  return async function POST(req: NextRequest) {
    const store = await cookies();
    const { accessToken, refreshToken } = readAuthCookies(store);

    // Best-effort backend revocation; local cookies are cleared regardless.
    await callBackend("/auth/logout", {
      method: "POST",
      accessToken,
      refreshToken,
      headers: clientIpHeaders(req.headers),
    });

    clearAuthCookies(store);
    return ok({ authenticated: false }, "Signed out");
  };
}

/* ------------------------------------------------------------ GET /session */

export function createSessionHandler() {
  return async function GET() {
    const store = await cookies();
    const session = await resolveSession(store);
    applySession(store, session);
    return ok({ authenticated: session.user !== null, user: session.user });
  };
}

/* ------------------------------------------- catch-all proxy /api/v1/[...] */

export interface ProxyOptions {
  /** Path prefix to strip from the incoming URL before hitting the backend. */
  stripPrefix?: string;
}

const HOP_BY_HOP = new Set(["host", "connection", "content-length", "accept-encoding", "cookie"]);

/**
 * Client-address headers are never copied from the browser: they are
 * client-controlled and would let anyone pick the IP the API rate-limits and
 * audits. The BFF sends its own value instead (see client-ip.ts).
 */
const isClientAddressHeader = (key: string) =>
  key === "forwarded" || key === "x-real-ip" || key.startsWith("x-forwarded-");

export function createProxyHandler(options: ProxyOptions = {}) {
  const stripPrefix = options.stripPrefix ?? "/api/v1";

  async function handle(req: NextRequest): Promise<NextResponse> {
    const store = await cookies();
    const { accessToken, refreshToken } = readAuthCookies(store);

    if (!accessToken && !refreshToken) {
      return fail(401, "Not authenticated");
    }

    const { pathname, search } = req.nextUrl;
    const backendPath = `${pathname.slice(stripPrefix.length) || "/"}${search}`;

    // Forward safe headers (notably Idempotency-Key for transfers), plus the
    // browser's IP as resolved through our trusted proxies.
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      const name = key.toLowerCase();
      if (!HOP_BY_HOP.has(name) && name !== "authorization" && !isClientAddressHeader(name)) {
        headers[key] = value;
      }
    });
    Object.assign(headers, clientIpHeaders(req.headers));

    const method = req.method.toUpperCase();
    const hasBody = method !== "GET" && method !== "HEAD";
    const rawBody = hasBody ? await req.text() : undefined;

    const doCall = (token?: string) =>
      callBackend(backendPath, {
        method,
        accessToken: token,
        headers,
        body: rawBody === undefined || rawBody === "" ? undefined : safeJson(rawBody),
      });

    let result = await doCall(accessToken);

    // Transparent refresh on a single 401 (single-flight across concurrent calls).
    if (result.status === 401 && refreshToken) {
      const refreshed = await refreshSession(refreshToken);
      const newAccess = refreshed.ok ? extractAccessToken(refreshed.body) : undefined;
      if (newAccess) {
        setAuthCookies(store, { accessToken: newAccess, refreshToken: refreshed.refreshToken });
        result = await doCall(newAccess);
      } else if (isRejected(refreshed)) {
        clearAuthCookies(store);
        return fail(401, "Session expired");
      } else {
        // Backend unreachable — keep the session and surface the outage.
        result = refreshed;
      }
    }

    if (result.status === 401) {
      clearAuthCookies(store);
    }

    return new NextResponse(result.raw || null, {
      status: result.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return {
    GET: handle,
    POST: handle,
    PUT: handle,
    PATCH: handle,
    DELETE: handle,
  };
}

function safeJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
