import axios from "@/lib/axios";

export interface IDashboardOverviewResponse {
  totalWalletBalance: number;
  totalUsers: number;
  totalTransactions: number;
  totalCashflow: number;
  transactionVolume: number;
}

const USE_MOCK = true; // 👈 toggle later

export const getDashboardOverview = async () => {
  if (USE_MOCK) {
    return Promise.resolve({
      totalWalletBalance: 12450000,
      totalUsers: 8432,
      totalTransactions: 152340,
      totalCashflow: 10890000,
      transactionVolume: 17130000,
    });
  }

  const response = await axios.get<IDashboardOverviewResponse>(
    "/dashboard/overview"
  );
  return response.data;
};
