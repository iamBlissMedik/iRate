/**
 * Wallets Data Adapter
 *
 * Transforms wallet data for admin UI consumption
 */

import { IWalletBalance } from "../types/wallets.types";
import { formatNaira, formatNairaCompact } from "@/shared/utils/currency.utils";
import { formatDate } from "@/shared/utils/date.utils";

export interface WalletDisplayData {
  id: string;
  userId: string;
  userEmail: string;
  balance: number;
  formattedBalance: string;
  compactBalance: string;
  currency: string;
  createdDate: string;
  lastUpdated: string;
}

export const adaptWalletForDisplay = (
  wallet: IWalletBalance,
): WalletDisplayData => {
  return {
    id: wallet.id,
    userId: wallet.userId,
    userEmail: wallet.user?.email || "Unknown",
    balance: wallet.balance,
    formattedBalance: formatNaira(wallet.balance),
    compactBalance: formatNairaCompact(wallet.balance),
    currency: wallet.currency || "NGN",
    createdDate: formatDate(wallet.createdAt),
    lastUpdated: formatDate(wallet.updatedAt),
  };
};

export const adaptWalletsListForDisplay = (wallets: IWalletBalance[]) => {
  return wallets.map(adaptWalletForDisplay);
};

export const calculateTotalBalance = (wallets: IWalletBalance[]): number => {
  return wallets.reduce((total, wallet) => total + wallet.balance, 0);
};
