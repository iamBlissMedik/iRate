import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LifeBuoy,
  LogOut,
} from "lucide-react";

export const sidebarLinks = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    id: "users",
    title: "Users",
    url: "#",
    icon: Users,
  },
  {
    id: "transactions",
    title: "Transactions",
    url: "#",
    icon: CreditCard,
  },
  {
    id: "analytics",
    title: "Analytics",
    url: "#",
    icon: BarChart3,
  },
  {
    id: "settings",
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    id: "support",
    title: "Support",
    url: "#",
    icon: LifeBuoy,
  },
  {
    id: "logout",
    title: "Logout",
    url: "#",
    icon: LogOut,
  },
];
