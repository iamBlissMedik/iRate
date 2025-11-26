"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon?: typeof LucideIcon;
  trend?: string;
  trendType?: "up" | "down";
  iconColor?: string; // optional color class for icon background
}

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = "up",
  iconColor = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}: DashboardStatCardProps) {
  return (
    <Card className="rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900
                     transition-transform transform hover:scale-[1.02] hover:shadow-lg duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </CardTitle>

        {Icon && (
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-transform duration-300 ${iconColor} group-hover:scale-110`}
          >
            <Icon size={20} />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
          {value}
        </p>

        {trend && (
          <p
            className={`text-sm font-medium mt-1 ${
              trendType === "up"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            } transition-colors duration-300`}
          >
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
