import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "../services/shared/api/overview.api";
import { handleAxiosError } from "@/lib/errors/handleAxiosError";
import { queryKeys } from "@/core/query/query-client";

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: queryKeys.admin.dashboard.overview(),
    queryFn: async () => {
      try {
        return await getDashboardOverview();
      } catch (error) {
        handleAxiosError(error, {
          fallbackMessage: "Failed to load dashboard overview",
        });
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
