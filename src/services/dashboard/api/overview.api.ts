import axios from "@/lib/axios";

export interface IDashboardOverviewResponse {
  totalWalletBalance: number;
  totalUsers: number;
  totalTransactions: number;
  totalCashflow: number;
  transactionVolume: number;
}

export interface IDashboardChartPoint {
  date: string; // ISO
  cashflow: number;
  volume: number;
}


export const getDashboardOverview = async () => {
  const response = await axios.get<IDashboardOverviewResponse>(
    "/admin/dashboard/overview"
  );
  return response.data;
};


