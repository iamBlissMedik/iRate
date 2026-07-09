"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import { kycSubmitSchema, type KYCSubmitInput, type KYCStatus } from "@irate/contracts";
import { useKycStatus, useSubmitKyc } from "@irate/api-client/react";
import { ApiError } from "@irate/api-client";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Skeleton,
  toast,
} from "@irate/ui";

const STATUS_VARIANT: Record<KYCStatus, "warning" | "success" | "destructive"> = {
  PENDING: "warning",
  VERIFIED: "success",
  REJECTED: "destructive",
};

export default function KycPage() {
  const { data: status, isLoading } = useKycStatus();
  const submit = useSubmitKyc();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KYCSubmitInput>({ resolver: zodResolver(kycSubmitSchema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await submit.mutateAsync(values);
      toast.success("KYC submitted", "We'll review your details shortly.");
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
    }
  });

  const verified = status?.status === "VERIFIED";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Identity verification</h1>
        {isLoading ? (
          <Skeleton className="h-6 w-20" />
        ) : status ? (
          <Badge variant={STATUS_VARIANT[status.status]}>{status.status}</Badge>
        ) : null}
      </div>

      {verified ? (
        <Card>
          <CardContent className="flex items-center gap-3 p-6">
            <ShieldCheck className="size-6 text-success" />
            <p className="text-sm">Your identity is verified. You have full access to iRate.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Submit your details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <Field id="fullName" label="Full legal name" error={errors.fullName?.message}>
                <Input id="fullName" {...register("fullName")} error={!!errors.fullName} />
              </Field>
              <Field id="dateOfBirth" label="Date of birth" error={errors.dateOfBirth?.message}>
                <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} error={!!errors.dateOfBirth} />
              </Field>
              <Field id="address" label="Residential address" error={errors.address?.message}>
                <Input id="address" {...register("address")} error={!!errors.address} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field id="idType" label="ID type" error={errors.idType?.message}>
                  <select
                    id="idType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...register("idType")}
                  >
                    <option value="NIN">NIN</option>
                    <option value="BVN">BVN</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVERS_LICENSE">Driver&apos;s license</option>
                    <option value="VOTERS_CARD">Voter&apos;s card</option>
                  </select>
                </Field>
                <Field id="idNumber" label="ID number" error={errors.idNumber?.message}>
                  <Input id="idNumber" {...register("idNumber")} error={!!errors.idNumber} />
                </Field>
              </div>
              <Button type="submit" className="w-full" loading={submit.isPending}>
                Submit for review
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
