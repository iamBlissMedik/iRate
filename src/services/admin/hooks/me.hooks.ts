import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAdminMe } from "../api/me.api";
import { handleAxiosError } from "@/lib/errors/handleAxiosError";

export const useAdminMe = () => {
  return useQuery({
    queryKey: ["adminMe"],
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
    refetchOnWindowFocus: false,
  });
};
