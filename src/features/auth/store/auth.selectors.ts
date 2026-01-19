/**
 * Auth Selectors
 *
 * Reusable selectors for auth state
 * Memoized for performance
 */

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/core/store/store";

// Base selector
const selectAuthState = (state: RootState) => state.auth;

// User selector
export const selectUser = createSelector(selectAuthState, (auth) => auth.user);

// Authentication status selector
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (auth) => auth.isAuthenticated,
);

// Access token selector
export const selectAccessToken = createSelector(
  selectAuthState,
  (auth) => auth.accessToken,
);

// User email selector
export const selectUserEmail = createSelector(
  selectUser,
  (user) => user?.email || null,
);

// User role selector
export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role || null,
);

// Is admin selector
export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === "ADMIN" || role === "SUPER_ADMIN",
);

// Email verified selector
export const selectEmailVerified = createSelector(
  selectUser,
  (user) => user?.emailVerified || false,
);

// MFA enabled selector
export const selectMfaEnabled = createSelector(
  selectUser,
  (user) => user?.mfaEnabled || false,
);
