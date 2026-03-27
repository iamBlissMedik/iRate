/**
 * useUsers Hooks
 *
 * Hooks for user management operations
 */

import { useQuery } from "@tanstack/react-query";
import {
  getAllUsers,
  getUsersStats,
  IGetUsersParams,
} from "../services/api/users/users.api";
import { handleAxiosError } from "@/lib/errors/handleAxiosError";
import { queryKeys } from "@/core/query/query-client";
import { ADMIN_CONFIG } from "../constants/admin.constants";

export const useUsers = (params?: IGetUsersParams) => {
  return useQuery({
    queryKey: queryKeys.admin.users.list(params as Record<string, unknown>),
    queryFn: async () => {
      try {
        return await getAllUsers(params);
      } catch (error) {
        handleAxiosError(error, { fallbackMessage: "Failed to fetch users" });
        throw error;
      }
    },
    staleTime: ADMIN_CONFIG.refresh.usersInterval,
    refetchOnWindowFocus: false,
  });
};

export const useUsersStats = () => {
  return useQuery({
    queryKey: queryKeys.admin.users.stats(),
    queryFn: async () => {
      try {
        return await getUsersStats();
      } catch (error) {
        handleAxiosError(error, {
          fallbackMessage: "Failed to fetch user statistics",
        });
        throw error;
      }
    },
    staleTime: ADMIN_CONFIG.refresh.dashboardInterval,
    refetchOnWindowFocus: false,
  });
};
