/**
 * Admin Wallets API
 *
 * API functions for wallet management and operations
 */

import axios from "@/lib/axios";
import {
  IWalletsBalanceResponse,
  ICreditWalletRequest,
  ICreditWalletResponse,
} from "../../../types/wallets.types";

export const getAllWalletsBalance = async () => {
  const response = await axios.get<IWalletsBalanceResponse>(
    "/admin/wallets/balance",
  );
  return response.data;
};

export const creditWallet = async (
  walletId: string,
  data: ICreditWalletRequest,
) => {
  const response = await axios.post<ICreditWalletResponse>(
    `/admin/credit/${walletId}`,
    data,
  );
  return response.data;
};
