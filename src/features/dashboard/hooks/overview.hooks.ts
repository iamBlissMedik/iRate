import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getDashboardOverview } from "../api/overview.api";
import { handleAxiosError } from "@/lib/errors/handleAxiosError";
import { queryKeys } from "@/core/query/query-client";

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: queryKeys.admin.dashboard.overview(),

    queryFn: async () => {
      try {
        return await getDashboardOverview();
      } catch (error) {
        handleAxiosError(error);
        toast.error("Failed to load dashboard overview");
        throw error;
      }
    },

    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

