import axios from "@/lib/axios";

export interface IDashboardChartPoint {
  date: string;
  cashflow: number;
  volume: number;
}

export const getDashboardCharts = async () => {
  const response = await axios.get<IDashboardChartPoint[]>(
    "/dashboard/charts",
  );
  return response.data;
};
