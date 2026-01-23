/**
 * useAdminMe Hook
 *
 * Refactored to follow new architecture patterns:
 * - Uses centralized query keys
 * - Follows feature-based organization
 * - Improved error handling
 * - Better TypeScript types
 *
 * TODO: Move to features/admin/hooks/ when creating admin feature module
 */

import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAdminMe } from "../api/me.api";
import { handleAxiosError } from "@/lib/errors/handleAxiosError";
import { queryKeys } from "@/core/query/query-client";

export const useAdminMe = () => {
  return useQuery({
    // Use centralized query key
    queryKey: queryKeys.admin.me(),

    queryFn: async () => {
      try {
        const { data } = await getAdminMe();
        return data;
      } catch (error) {
        handleAxiosError(error);
        toast.error("Failed to fetch admin info");
        throw error;
      }
    },

    // Configuration
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
