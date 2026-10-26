/**
 * @irate/ui — the shared design system.
 *
 * - `components/ui/*` are shadcn/ui components (added with the shadcn CLI and
 *   owned by us); the most used ones are re-exported here.
 * - `components/*` are iRate compositions built on top of them.
 * - Charts and motion live in their own entry points (`@irate/ui/charts`,
 *   `@irate/ui/motion`) so pages that don't need them don't pull them in.
 *
 * Anything not re-exported here can be imported directly, e.g.
 * `import { Sheet } from "@irate/ui/components/ui/sheet"`.
 */

export { cn } from "./lib/utils";

/* shadcn/ui */
export { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
export { Badge, badgeVariants } from "./components/ui/badge";
export { Button, buttonVariants } from "./components/ui/button";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "./components/ui/field";
export { Input } from "./components/ui/input";
export { Label } from "./components/ui/label";
export { NativeSelect, NativeSelectOption } from "./components/ui/native-select";
export { Separator } from "./components/ui/separator";
export { Skeleton } from "./components/ui/skeleton";
export { Toaster } from "./components/ui/sonner";
export { toast } from "sonner";
export { Spinner } from "./components/ui/spinner";
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

/* iRate compositions */
export { AppShell } from "./components/app-shell";
export { AuthLayout } from "./components/auth-layout";
export type { AppShellProps, LinkComponent, NavItem } from "./components/app-shell";
export { EmptyState } from "./components/empty-state";
export { ErrorState } from "./components/error-state";
export { KycStatusBadge } from "./components/kyc-status-badge";
export { Logo } from "./components/logo";
export { BalanceAmount, Money } from "./components/money";
export type { MoneyProps } from "./components/money";
export { PageHeader } from "./components/page-header";
export { StatCard } from "./components/stat-card";
export type { StatCardProps } from "./components/stat-card";
export { ThemeProvider } from "./components/theme-provider";
export { ThemeToggle } from "./components/theme-toggle";
