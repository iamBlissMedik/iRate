import { IDashboardOverviewResponse } from "@/services/dashboard/api/overview.api";
import { formatNairaCompact } from "@/shared/utils/currency.utils";

export interface DashboardStatItem {
  id: string;
  title: string;
  value: string | number;
}

export const mapOverviewToStats = (
  data: IDashboardOverviewResponse,
): DashboardStatItem[] => {
  return [
    {
      id: "wallet-balance",
      title: "Total Wallet Balance",
      value: formatNairaCompact(data.totalWalletBalance),
    },
    {
      id: "users",
      title: "Total Users",
      value: data.totalUsers,
    },
    {
      id: "transactions",
      title: "Total Transactions",
      value: data.totalTransactions,
    },
    {
      id: "cashflow",
      title: "Total Cashflow",
      value: formatNairaCompact(data.totalCashflow),
    },
    {
      id: "volume",
      title: "Transaction Volume",
      value: formatNairaCompact(data.transactionVolume),
    },
  ];
};
