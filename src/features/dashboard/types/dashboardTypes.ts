import { LucideIcon } from "lucide-react";

export interface IStat {
  id: number;
  title: string;
  value: string;
  icon?: string | LucideIcon;
  trend: string;
  trendType: "up" | "down";
  iconColor: string;
}

