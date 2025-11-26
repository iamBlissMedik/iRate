"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Transactions",
      data: [120, 200, 150, 250, 300, 180, 220],
      borderColor: "#3B82F6",
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      tension: 0.3,
    },
  ],
};

export default function TransactionVolumeChart() {
  return (
    <div className="bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-sidebar-foreground mb-4">Transaction Volume (Weekly)</h2>
      <Line data={data} />
    </div>
  );
}
