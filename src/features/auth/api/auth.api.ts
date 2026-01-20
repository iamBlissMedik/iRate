/**
 * Auth API
 *
 * All authentication-related API calls
 * Single source of truth for auth endpoints
 */

import { apiClient } from "@/core/api/client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  AuthUser,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "./auth.types";

export const authApi = {
  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>("/auth/login", data);
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>("/auth/register", data);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    return apiClient.post<void>("/auth/logout");
  },

  /**
   * Refresh access token
   */
  refresh: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return apiClient.post<RefreshTokenResponse>("/auth/refresh", data);
  },

  /**
   * Get current authenticated user
   */
  getMe: async (): Promise<AuthUser> => {
    return apiClient.get<AuthUser>("/auth/me");
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return apiClient.post<void>("/auth/change-password", data);
  },

  /**
   * Request password reset
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    return apiClient.post<void>("/auth/forgot-password", data);
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    return apiClient.post<void>("/auth/reset-password", data);
  },

  /**
   * Verify email
   */
  verifyEmail: async (token: string): Promise<void> => {
    return apiClient.post<void>("/auth/verify-email", { token });
  },

  /**
   * Resend verification email
   */
  resendVerification: async (): Promise<void> => {
    return apiClient.post<void>("/auth/resend-verification");
  },
};
