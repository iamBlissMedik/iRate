/**
 * Sanitize a post-login `?from=` value so it can only point inside this app.
 * Rejects protocol-relative paths ("//evil.com", "/\evil.com") and control
 * characters, which browsers strip — "/\t/evil.com" becomes "//evil.com".
 */
export function safeRedirectPath(path: string | null | undefined, fallback = "/"): string {
  if (!path || !path.startsWith("/") || /^\/[/\\]/.test(path) || /[\u0000-\u001f]/.test(path)) {
    return fallback;
  }
  return path;
}
