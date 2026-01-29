import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getDashboardCharts } from "../api/charts.api";
import { handleAxiosError } from "@/lib/errors/handleAxiosError";
import { queryKeys } from "@/core/query/query-client";

export const useDashboardCharts = () => {
  return useQuery({
    queryKey: queryKeys.admin.dashboard.charts(),
    queryFn: async () => {
      try {
        return await getDashboardCharts();
      } catch (error) {
        handleAxiosError(error);
        toast.error("Failed to load dashboard charts");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};
