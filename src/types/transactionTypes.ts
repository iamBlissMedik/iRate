// /types/transactionTypes.ts

export type TransactionType = "fund" | "transfer" | "withdraw";
export type TransactionStatus = "success" | "pending" | "failed";

export interface Transaction {
  id: number;
  user: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
}
