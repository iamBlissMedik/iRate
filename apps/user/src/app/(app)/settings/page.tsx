"use client";

import { LogOut } from "lucide-react";
import { useMe, useSignOut } from "@irate/api-client/react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  PageHeader,
  Separator,
  Skeleton,
} from "@irate/ui";

export default function SettingsPage() {
  const { data: me, isLoading } = useMe();
  const signOut = useSignOut();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Your account details." />
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Contact support to change these details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <Row label="Email" value={me?.email} loading={isLoading} />
          <Separator />
          <Row
            label="Role"
            value={me && me.role.charAt(0) + me.role.slice(1).toLowerCase()}
            loading={isLoading}
          />
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            onClick={() => signOut.mutate()}
            loading={signOut.isPending}
          >
            <LogOut /> Sign out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function Row({ label, value, loading }: { label: string; value?: string; loading: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      {loading ? (
        <Skeleton className="h-4 w-40" />
      ) : (
        <span className="truncate font-medium">{value ?? "—"}</span>
      )}
    </div>
  );
}
