"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "New Users",
      data: [20, 35, 40, 25, 50, 30, 45],
      backgroundColor: "#10B981",
    },
  ],
};

export default function NewUsersChart() {
  return (
    <div className="bg-sidebar border border-sidebar-border rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-sidebar-foreground mb-4">New Users (Weekly)</h2>
      <Bar data={data} />
    </div>
  );
}
