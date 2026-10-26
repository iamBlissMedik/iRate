"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, Home, Receipt, Settings, ShieldCheck } from "lucide-react";
import { useSession, useSignOut } from "@irate/api-client/react";
import { AppShell, type NavItem } from "@irate/ui";

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/send", label: "Send money", icon: ArrowLeftRight },
  { href: "/transactions", label: "Activity", icon: Receipt },
  { href: "/kyc", label: "Verification", icon: ShieldCheck },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** The signed-in wallet layout (sidebar, top bar, page transitions). */
export function Shell({ defaultOpen, children }: { defaultOpen: boolean; children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const signOut = useSignOut();

  return (
    <AppShell
      product="Wallet"
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
