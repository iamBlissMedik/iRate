"use client";

import type { ComponentType, ReactNode } from "react";
import { ChevronsUpDown, LogOut, type LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@irate/ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@irate/ui/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@irate/ui/components/ui/sidebar";
import { Logo } from "@irate/ui/components/logo";
import { ThemeToggle } from "@irate/ui/components/theme-toggle";
import { PageTransition } from "@irate/ui/motion";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Router-aware link (pass `next/link`) so navigation stays client-side. */
export type LinkComponent = ComponentType<{
  href: string;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}>;

export interface AppShellProps {
  /** Product name shown under the logo, e.g. "Wallet" or "Admin". */
  product: string;
  nav: NavItem[];
  /** Current pathname — selects the active nav item and keys the page transition. */
  pathname: string;
  linkComponent: LinkComponent;
  user?: { email: string; role?: string } | null;
  onSignOut: () => void;
  /** Initial desktop sidebar state (read from the `sidebar_state` cookie). */
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Authenticated layout shared by both apps: a collapsible shadcn sidebar
 * (an off-canvas sheet on mobile) with the nav and account menu, plus a top
 * bar with the sidebar trigger and theme toggle.
 */
export function AppShell({ defaultOpen, pathname, children, ...sidebarProps }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <ShellSidebar pathname={pathname} {...sidebarProps} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <ThemeToggle className="ml-auto" />
        </header>
        <div className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6 lg:p-8">
          <PageTransition routeKey={pathname}>{children}</PageTransition>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/** The nav item whose href is the longest prefix of the pathname. */
function activeHref(nav: NavItem[], pathname: string): string | undefined {
  return nav
    .filter(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

function ShellSidebar({
  product,
  nav,
  pathname,
  linkComponent: Link,
  user,
  onSignOut,
}: Omit<AppShellProps, "defaultOpen" | "children">) {
  const { isMobile, setOpenMobile } = useSidebar();
  const current = activeHref(nav, pathname);
  const closeMobile = () => setOpenMobile(false);
  const email = user?.email ?? "";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={nav[0]?.href ?? "/"} onClick={closeMobile}>
                <Logo variant="mark" />
                <span className="grid flex-1 leading-tight">
                  <span className="truncate font-semibold">iRate</span>
                  <span className="truncate text-xs text-muted-foreground">{product}</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={href === current} tooltip={label}>
                    <Link href={href} onClick={closeMobile}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {email ? email.slice(0, 2).toUpperCase() : "…"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{email || "Account"}</span>
                    {user?.role ? (
                      <span className="truncate text-xs text-muted-foreground capitalize">
                        {user.role.toLowerCase()}
                      </span>
                    ) : null}
                  </span>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                align="end"
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
              >
                <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                  {email || "Signed in"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={onSignOut}>
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
