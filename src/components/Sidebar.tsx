"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { sidebarLinks } from "@/constants/navLinks";

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-sidebar-primary text-sidebar-primary-foreground rounded-(--radius-md) shadow-md lg:hidden hover:bg-sidebar-accent transition-colors duration-200"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-40 flex flex-col justify-between
          shadow-md bg-sidebar text-sidebar-foreground
          transition-all duration-300 ease-in-out

          /* Mobile slide behavior (unchanged) */
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0

          /* Desktop & Tablet always full width */
          w-64
          lg:w-64

          bg-sidebar text-sidebar-foreground
        `}
      >
        {/* Top Section */}
        <div className="flex-1 overflow-y-auto">
          {/* Header / Logo */}
          <div className="p-4 border-b border-sidebar-border min-h-[100px] flex flex-col justify-center items-center">
            {/* Full logo (always centered) */}
            <div className="text-center transition-opacity duration-300">
              <h1 className="text-xl font-bold">IRATE</h1>
              <p className="text-sidebar-accent-foreground text-sm mt-1">Admin Panel</p>
            </div>
          </div>


          {/* Navigation Links */}
          <nav className="mt-6 px-2">
            <ul className="space-y-2">
              {sidebarLinks
                .filter((link) => link.id !== "logout") // skip logout for bottom section
                .map((item) => {
                  const isActive = pathname === item.url;
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.url}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-(--radius-md)
                          transition-colors duration-200
                          ${isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }
                          justify-start
                        `}
                        title={item.title}
                      >
                        {Icon && <Icon size={22} className="shrink-0" />}
                        <span className="whitespace-nowrap transition-all duration-300">
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </nav>
        </div>

        {/* Logout at bottom */}
        <div className="border-t border-sidebar-border p-4">
          <Link
            href="/logout"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-(--radius-md)
              text-sidebar-foreground
              hover:bg-destructive hover:text-sidebar-primary-foreground
              transition-colors duration-200
              justify-start
            `}
            title="Logout"
          >
            {(() => {
              const logoutItem = sidebarLinks.find((l) => l.id === "logout");
              if (!logoutItem || !logoutItem.icon) return null;
              const LogoutIcon = logoutItem.icon;
              return <LogoutIcon size={22} className="shrink-0" />;
            })()}
            <span className="whitespace-nowrap transition-all duration-300">Logout</span>
          </Link>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
