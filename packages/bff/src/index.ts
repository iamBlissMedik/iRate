/**
 * @irate/bff — the Backend-for-Frontend layer shared by both Next.js apps.
 *
 * The browser only ever talks to same-origin routes; these factories turn the
 * session into httpOnly cookies and attach the Bearer token server-side.
 *
 *   app/api/auth/{login,register,logout,session}/route.ts → create*Handler()
 *   app/api/v1/[...path]/route.ts                         → createProxyHandler()
 *   src/proxy.ts                                          → createAuthProxy()
 */
export { getBffConfig } from "./config";
export type { BffConfig } from "./config";
export { clearAuthCookies, readAuthCookies, setAuthCookies } from "./cookies";
export type { AuthTokens, CookieReader, CookieWriter } from "./cookies";
export { callBackend, extractAccessToken } from "./backend";
export { clientIpHeaders, resolveClientIp } from "./client-ip";
export type { BackendResult } from "./backend";
export { decodeJwtPayload, sessionUserFromToken } from "./jwt";
export { applySession, resolveSession } from "./session";
export type { ResolvedSession } from "./session";
export {
  createLoginHandler,
  createLogoutHandler,
  createProxyHandler,
  createRegisterHandler,
  createSessionHandler,
} from "./handlers";
export type { LoginHandlerOptions, ProxyOptions } from "./handlers";
export { createAuthProxy } from "./proxy";
export type { AuthProxyOptions } from "./proxy";
