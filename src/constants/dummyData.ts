import { IStat } from "@/types/dashboardTypes";
import { Wallet, Users, Banknote, Activity } from "lucide-react";
export   const stats: IStat[] = [
  {
    id: 1,
    title: "Total Wallet Balance",
    value: "₦12,450,000",
    icon: Wallet,
    trend: "+2.4%",
    trendType: "up",
    iconColor:
      "text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300",
  },
  {
    id: 2,
    title: "Total Users",
    value: "8,432",
    icon: Users,
    trend: "+380 today",
    trendType: "up",
    iconColor:
      "text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300",
  },
  {
    id: 3,
    title: "Total Transactions",
    value: "152,340",
    icon: Banknote,
    trend: "+3.8%",
    trendType: "up",
    iconColor:
      "text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-300",
  },
  {
    id: 4,
    title: "Weekly Activity",
    value: "+12.4%",
    icon: Activity,
    trend: "from last week",
    trendType: "up",
    iconColor:
      "text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-300",
  },
];