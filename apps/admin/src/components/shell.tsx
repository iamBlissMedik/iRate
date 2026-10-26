"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldCheck, Users, Wallet } from "lucide-react";
import { useSession, useSignOut } from "@irate/api-client/react";
import { AppShell, type NavItem } from "@irate/ui";

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/kyc", label: "KYC review", icon: ShieldCheck },
  { href: "/dashboard/wallets", label: "Wallets", icon: Wallet },
];

/** The signed-in console layout (sidebar, top bar, page transitions). */
export function Shell({ defaultOpen, children }: { defaultOpen: boolean; children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const signOut = useSignOut();

  return (
    <AppShell
      product="Admin"
      nav={NAV}
      pathname={pathname}
      linkComponent={Link}
      user={session?.user}
      onSignOut={() => signOut.mutate()}
      defaultOpen={defaultOpen}
    >
      {children}
    </AppShell>
  );
}
