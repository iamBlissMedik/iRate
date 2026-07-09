// /constants/navLinks.ts
import { LayoutDashboard, Users, ShieldCheck, Wallet, LogOut } from "lucide-react";

export const sidebarLinks = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "users",
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    id: "kyc",
    title: "KYC",
    url: "/dashboard/kyc",
    icon: ShieldCheck,
  },
  {
    id: "wallets",
    title: "Wallets",
    url: "/dashboard/wallets",
    icon: Wallet,
  },
  {
    id: "logout",
    title: "Logout",
    url: "#",
    icon: LogOut,
  },
];
