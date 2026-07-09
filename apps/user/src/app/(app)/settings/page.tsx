"use client";

import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, Separator, toast } from "@irate/ui";
import { useLogout, useMe } from "@irate/api-client/react";

export default function SettingsPage() {
  const router = useRouter();
  const logout = useLogout();
  const { data: me } = useMe();

  const onLogout = async () => {
    await logout.mutateAsync();
    toast.success("Signed out");
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <Row label="Email" value={me?.email ?? "—"} />
          <Separator />
          <Row label="Role" value={me?.role ?? "—"} />
          <Separator />
          <div className="pt-2">
            <Button variant="destructive" onClick={onLogout} loading={logout.isPending}>
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
