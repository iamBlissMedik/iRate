/**
 * Environment configuration
 * Centralized access to environment variables with type safety
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const env = {
  // API Configuration
  apiBaseUrl: getEnvVar(
    "NEXT_PUBLIC_API_BASE_URL",
    "http://localhost:4000/api/v1",
  ),
  apiTimeout: parseInt(getEnvVar("NEXT_PUBLIC_API_TIMEOUT", "30000")),

  // App Configuration
  appName: getEnvVar("NEXT_PUBLIC_APP_NAME", "iRate"),
  appUrl: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  environment: getEnvVar("NODE_ENV", "development"),

  // Feature Flags
  enableDevTools: getEnvVar("NEXT_PUBLIC_ENABLE_DEV_TOOLS", "true") === "true",
  enableAnalytics:
    getEnvVar("NEXT_PUBLIC_ENABLE_ANALYTICS", "false") === "true",

  // External Services (optional)
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
} as const;

// Type-safe environment object
export type Env = typeof env;

// Helper to check if we're in production
export const isProduction = env.environment === "production";
export const isDevelopment = env.environment === "development";
export const isTest = env.environment === "test";
