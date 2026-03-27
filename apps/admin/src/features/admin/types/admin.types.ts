/**
 * Admin Core Types
 *
 * Types for admin authentication and profile
 */

export interface ITransaction {
  id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  createdAt: string;
}

export interface IWallet {
  id: string;
  balance: number;
  createdAt: string;
  Transaction: ITransaction[];
}

export interface IAdminData {
  id: string;
  email: string;
  role: "ADMIN";
  createdAt: string;
}

export interface IAdminResponse {
  success: boolean;
  message: string;
  data: IAdminData;
}

/**
 * Admin profile with pagination
 */
export interface IAdminProfile {
  id: string;
  email: string;
  role: "ADMIN";
  createdAt: string;
  wallets?: IWallet[];
  transactions?: ITransaction[];
}
