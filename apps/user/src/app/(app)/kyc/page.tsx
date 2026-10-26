"use client";

import { Clock, ShieldCheck } from "lucide-react";
import { useKycStatus } from "@irate/api-client/react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  KycStatusBadge,
  PageHeader,
  Skeleton,
} from "@irate/ui";
import { KycForm } from "@/features/kyc/kyc-form";

export default function KycPage() {
  const { data: kyc, isLoading } = useKycStatus();
  const status = kyc?.status;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Identity verification"
        description="Verify your identity to unlock the full iRate experience."
        actions={isLoading ? <Skeleton className="h-5 w-20" /> : <KycStatusBadge status={status} />}
      />

      {isLoading ? (
        <Skeleton className="h-96 max-w-xl" />
      ) : status === "VERIFIED" ? (
        <Card className="max-w-xl">
          <EmptyState
            icon={ShieldCheck}
            title="You're verified"
            description="Your identity has been confirmed. You have full access to iRate."
          />
        </Card>
      ) : status === "PENDING" ? (
        <Card className="max-w-xl">
          <EmptyState
            icon={Clock}
            title="Under review"
            description="We've received your details and will update you once the review is done."
          />
        </Card>
      ) : (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Your details</CardTitle>
            <CardDescription>They must match your government-issued ID.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {status === "REJECTED" ? (
              <Alert variant="destructive">
                <AlertTitle>Your last submission was rejected</AlertTitle>
                <AlertDescription>
                  Check your details against your ID and submit again.
                </AlertDescription>
              </Alert>
            ) : null}
            <KycForm />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
