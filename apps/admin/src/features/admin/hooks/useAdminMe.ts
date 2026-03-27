/**
 * useAdminMe Hook
 *
 * Hook for fetching admin profile information
 */

import { useQuery } from "@tanstack/react-query";
import { getAdminMe } from "../services/api/admin/me.api";
import { handleAxiosError } from "@/lib/errors/handleAxiosError";
import { queryKeys } from "@/core/query/query-client";
import { ADMIN_CONFIG } from "../constants/admin.constants";

export const useAdminMe = () => {
  return useQuery({
    queryKey: queryKeys.admin.me(),
    queryFn: async () => {
      try {
        const { data } = await getAdminMe();
        return data;
      } catch (error) {
        handleAxiosError(error, {
          fallbackMessage: "Failed to fetch admin info",
        });
        throw error;
      }
    },
    staleTime: ADMIN_CONFIG.refresh.dashboardInterval,
    refetchOnWindowFocus: false,
  });
};
