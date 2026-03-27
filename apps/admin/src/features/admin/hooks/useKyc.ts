/**
 * useKyc Hooks
 *
 * Hooks for KYC verification and management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getAllKycs,
  reviewKyc,
  IGetKycsParams,
} from "../services/api/kyc/kyc.api";
import { IKycReviewRequest } from "../types/kyc.types";
import { handleAxiosError } from "@/lib/errors/handleAxiosError";
import { queryKeys } from "@/core/query/query-client";
import { ADMIN_CONFIG } from "../constants/admin.constants";

export const useKycs = (params?: IGetKycsParams) => {
  return useQuery({
    queryKey: queryKeys.admin.kyc.list(params as Record<string, unknown>),
    queryFn: async () => {
      try {
        return await getAllKycs(params);
      } catch (error) {
        handleAxiosError(error, {
          fallbackMessage: "Failed to fetch KYC documents",
        });
        throw error;
      }
    },
    staleTime: ADMIN_CONFIG.refresh.kycInterval,
    refetchOnWindowFocus: false,
  });
};

export const useReviewKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      kycId,
      data,
    }: {
      kycId: string;
      data: IKycReviewRequest;
    }) => {
      return await reviewKyc(kycId, data);
    },
    onSuccess: (response) => {
      toast.success(response.message || "KYC reviewed successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.kyc.all() });
    },
    onError: (error) => {
      handleAxiosError(error, { fallbackMessage: "Failed to review KYC" });
    },
  });
};
