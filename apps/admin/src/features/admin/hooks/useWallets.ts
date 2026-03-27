/**
 * useWallets Hooks
 *
 * Hooks for wallet management operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getAllWalletsBalance,
  creditWallet,
} from "../services/api/wallets/wallets.api";
import { ICreditWalletRequest } from "../types/wallets.types";
import { handleAxiosError } from "@/lib/errors/handleAxiosError";
import { queryKeys } from "@/core/query/query-client";
import { ADMIN_CONFIG } from "../constants/admin.constants";

export const useWalletsBalance = () => {
  return useQuery({
    queryKey: queryKeys.admin.wallets.balance(),
    queryFn: async () => {
      try {
        return await getAllWalletsBalance();
      } catch (error) {
        handleAxiosError(error, {
          fallbackMessage: "Failed to fetch wallets balance",
        });
        throw error;
      }
    },
    staleTime: ADMIN_CONFIG.refresh.walletsInterval,
    refetchOnWindowFocus: false,
  });
};

export const useCreditWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      walletId,
      data,
    }: {
      walletId: string;
      data: ICreditWalletRequest;
    }) => {
      return await creditWallet(walletId, data);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Wallet credited successfully");
      // Invalidate wallet and transaction queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.wallets.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.dashboard.all(),
      });
    },
    onError: (error) => {
      handleAxiosError(error, {
        fallbackMessage: "Failed to credit wallet",
      });
    },
  });
};
