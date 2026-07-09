export interface ITransaction {
  id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  createdAt: string; // or Date if you parse it
}

export interface IWallet {
  id: string;
  balance: number;
  createdAt: string; // or Date
  Transaction: ITransaction[];
}

export interface IAdminData {
  id: string;
  email: string;
  role: "ADMIN";
  createdAt: string; // or Date
}
export interface IAdminResponse {
  success: boolean;
  message: string;
  data: IAdminData;
}
