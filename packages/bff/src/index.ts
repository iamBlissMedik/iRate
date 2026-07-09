export { getBffConfig } from "./config";
export type { BffConfig } from "./config";
export {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "./cookies";
export { callBackend, extractAccessToken } from "./backend";
export type { BackendResult } from "./backend";
export { decodeJwtPayload, sessionUserFromToken } from "./jwt";
export {
  createLoginHandler,
  createRegisterHandler,
  createLogoutHandler,
  createSessionHandler,
  createProxyHandler,
} from "./handlers";
export type { ProxyOptions } from "./handlers";
export { createAuthMiddleware } from "./middleware";
export type { AuthMiddlewareOptions } from "./middleware";
export { API_AUTH_PATHS, API_PROXY_PREFIX } from "./paths";
