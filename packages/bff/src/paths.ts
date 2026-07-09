/** Same-origin BFF paths, shared with middleware for route protection. */
export const API_AUTH_PATHS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  logout: "/api/auth/logout",
  session: "/api/auth/session",
} as const;

export const API_PROXY_PREFIX = "/api/v1";
