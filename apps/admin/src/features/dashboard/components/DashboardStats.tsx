"use client";

import { memo } from "react";
import { Activity, ArrowLeftRight, Banknote, Users, Wallet } from "lucide-react";
import { StatCard } from "@irate/ui";
import { Stagger } from "@irate/ui/motion";
import { useAdminOverview } from "@irate/api-client/react";
import { formatMoney, minorToMajorNumber } from "@irate/contracts/money";
import type { AdminStatCard } from "@irate/contracts";

/**
 * DashboardStats — shared @irate/ui StatCard fed by `useAdminOverview`. Figures
 * count up on mount (money formats as currency, counts as plain numbers).
 */

function statProps(card?: AdminStatCard) {
  if (!card) return { value: "—" as string };
  if (typeof card.value === "number") {
    return {
      value: card.value.toLocaleString(),
      numericValue: card.value,
      format: (n: number) => Math.round(n).toLocaleString(),
    };
  }
  return {
    value: formatMoney(card.value, { currency: card.currency }),
    numericValue: minorToMajorNumber(card.value),
    format: (n: number) => formatMoney(Math.round(n * 100), { currency: card.currency }),
  };
}

const DashboardStats = () => {
  const { data, isLoading, isError } = useAdminOverview();

  if (isError) {
    return <p className="text-sm text-destructive">Failed to load dashboard statistics</p>;
  }

  const cards = [
    { label: "Total Wallet Balance", icon: Wallet, ...statProps(data?.walletsBalance), delta: data?.walletsBalance?.trend },
    { label: "Total Users", icon: Users, ...statProps(data?.usersStats), delta: data?.usersStats?.trend },
    { label: "Transactions", icon: ArrowLeftRight, ...statProps(data?.transactionStats), delta: data?.transactionStats?.trend },
    { label: "Total Cashflow", icon: Banknote, ...statProps(data?.totalCashflow), delta: data?.totalCashflow?.trend },
    { label: "Transaction Volume", icon: Activity, ...statProps(data?.transactionVolume), delta: data?.transactionVolume?.trend },
  ];

  return (
    <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((c) => (
        <Stagger.Item key={c.label}>
          <StatCard
            label={c.label}
            value={c.value}
            numericValue={c.numericValue}
            format={c.format}
            icon={c.icon}
            delta={c.delta}
            loading={isLoading}
          />
        </Stagger.Item>
      ))}
    </Stagger>
  );
};

export default memo(DashboardStats);
