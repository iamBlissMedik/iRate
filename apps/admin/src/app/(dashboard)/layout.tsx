import { cookies } from "next/headers";
import { Shell } from "@/components/shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Restore the desktop sidebar's collapsed/expanded state (set by shadcn's sidebar).
  const defaultOpen = (await cookies()).get("sidebar_state")?.value !== "false";
  return <Shell defaultOpen={defaultOpen}>{children}</Shell>;
}
