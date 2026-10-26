"use client";

import { Activity, ArrowLeftRight, Banknote, Users, Wallet, type LucideIcon } from "lucide-react";
import type { AdminOverview, AdminStatCard } from "@irate/contracts";
import { formatMajor, minorToMajorNumber } from "@irate/contracts/money";
import { useAdminOverview } from "@irate/api-client/react";
import { StatCard } from "@irate/ui";
import { Stagger } from "@irate/ui/motion";

const CARDS: { key: keyof AdminOverview; label: string; icon: LucideIcon }[] = [
  { key: "walletsBalance", label: "Total wallet balance", icon: Wallet },
  { key: "usersStats", label: "Users", icon: Users },
  { key: "transactionStats", label: "Transactions", icon: ArrowLeftRight },
  { key: "totalCashflow", label: "Total cashflow", icon: Banknote },
  { key: "transactionVolume", label: "Transaction volume", icon: Activity },
];

/** Counts arrive as numbers; money as minor-unit strings (animated in major units). */
function statValue(card: AdminStatCard | undefined) {
  if (!card) return { value: "—" };
  if (typeof card.value === "number") return { value: card.value };
  return {
    value: minorToMajorNumber(card.value),
    format: (n: number) => formatMajor(n, { currency: card.currency }),
  };
}

/** Headline platform metrics from `GET /admin/dashboard/overview`. */
export function DashboardStats() {
  const { data, isLoading } = useAdminOverview();

  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {CARDS.map(({ key, label, icon }) => (
        <Stagger.Item key={key}>
          <StatCard
            label={label}
            icon={icon}
            delta={data?.[key].trend}
            loading={isLoading}
            {...statValue(data?.[key])}
          />
        </Stagger.Item>
      ))}
    </Stagger>
  );
}
