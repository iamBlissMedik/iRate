/**
 * Auth Feature Module
 *
 * NOTE: Hooks, store, and components are client-only.
 * Import them directly from their sub-paths in server components:
 *   import { LoginForm } from '@/features/auth/components';
 *
 * This barrel is safe for client components only.
 */

// Components
export * from "./components";

// Services (safe for both client and server)
export * from "./services";

// Types (safe for both client and server)
export * from "./types";
