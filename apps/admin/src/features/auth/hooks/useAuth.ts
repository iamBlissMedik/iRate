/**
 * useAuth Hook
 *
 * Main hook for authentication state and operations
 * Combines React Query and Redux for comprehensive auth management
 */

import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/core/store/hooks";
import { logout as logoutAction } from "../store/auth.slice";
import { authApi } from "../services/api/auth.api";
import { queryKeys } from "@/core/query/query-client";
import { apiClient } from "@/core/api/client";
import { useRouter } from "next/navigation";
import { selectIsAuthenticated, selectUser } from "../store/auth.selectors";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Fetch current user if authenticated
  const {
    data: currentUser,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authApi.getMe,
    enabled: isAuthenticated && !user, // Only fetch if authenticated but no user in store
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear tokens and Redux state
      apiClient.clearTokens();
      dispatch(logoutAction());
      router.push("/login");
    }
  }, [dispatch, router]);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback(
    (role: string | string[]): boolean => {
      if (!user) return false;

      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(user.role);
    },
    [user],
  );

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback((): boolean => {
    return hasRole(["ADMIN", "SUPER_ADMIN"]);
  }, [hasRole]);

  return {
    user: user || currentUser,
    isAuthenticated: isAuthenticated && !!apiClient.getAccessToken(),
    isLoading,
    error,
    logout,
    refetch,
    hasRole,
    isAdmin,
  };
};
