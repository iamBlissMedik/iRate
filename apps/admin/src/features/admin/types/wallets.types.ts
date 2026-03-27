/**
 * Admin Wallets Management Types
 *
 * Types for wallet operations and balance management
 */

export interface IWalletBalance {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface IWalletsBalanceResponse {
  success: boolean;
  message: string;
  data: {
    totalBalance: number;
    wallets: IWalletBalance[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ICreditWalletRequest {
  amount: number;
  description?: string;
  reference?: string;
}

export interface ICreditWalletResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    walletId: string;
    newBalance: number;
  };
}
