"use client";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { useEffect, memo } from "react";
import { useSession } from "@irate/api-client/react";

function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  // Session comes from the BFF (httpOnly cookie) — no NextAuth.
  const { data, isLoading } = useSession();
  const router = useRouter();

  const authenticated = data?.authenticated ?? false;

  useEffect(() => {
    if (!isLoading && !authenticated) {
      router.push("/login");
    }
  }, [isLoading, authenticated, router]);

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex h-screen mx-auto max-w-full  ">
      <Sidebar />
      <main className="flex-1 overflow-auto w-full px-[59px] pt-10 pb-16 lg:ml-64 ">
        <div className=" mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default memo(DashboardLayoutClient);
