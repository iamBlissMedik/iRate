"use client";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const DashboardLayoutClient = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div>Loading...</div>;
  return (
    <div className="flex h-screen mx-auto max-w-full  ">
      <Sidebar />
      <main className="flex-1 overflow-auto w-full px-[59px] pt-10 pb-16 lg:ml-64 ">
        <div className=" mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayoutClient;
