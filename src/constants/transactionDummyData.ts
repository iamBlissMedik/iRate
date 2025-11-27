import { Transaction } from "@/types/transactionTypes";

export const recentTransactions: Transaction[] = [
  {
    id: 1,
    user: "John Doe",
    amount: 5000,
    type: "fund",
    status: "success",
  },
  {
    id: 2,
    user: "Janet Bello",
    amount: 12000,
    type: "transfer",
    status: "pending",
  },
  {
    id: 3,
    user: "Mark Ade",
    amount: 2500,
    type: "withdraw",
    status: "failed",
  },
];
