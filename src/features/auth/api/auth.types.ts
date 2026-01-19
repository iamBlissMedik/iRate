/**
 * Auth API Types
 *
 * Type definitions for authentication-related API requests and responses
 */

import { UserRole } from "@/shared/types/common.types";

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Register response
 */
export interface RegisterResponse {
  user: AuthUser;
  message: string;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  accessToken: string;
}

/**
 * Authenticated user data
 */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
}

/**
 * Change password request
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Forgot password request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset password request
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
