"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { transferSchema, type TransferInput } from "@irate/contracts";
import { majorToMinor, formatMoney } from "@irate/contracts/money";
import { useResolveAccount, useTransfer } from "@irate/api-client/react";
import { ApiError } from "@irate/api-client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  toast,
} from "@irate/ui";

interface FormShape {
  toAccountNumber: string;
  amountMajor: string;
  note?: string;
}

export function SendMoneyForm() {
  const router = useRouter();
  const transfer = useTransfer();
  const [account, setAccount] = useState("");

  const resolve = useResolveAccount(account);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormShape>({
    defaultValues: { toAccountNumber: "", amountMajor: "", note: "" },
  });

  const amountMajor = watch("amountMajor");

  const onSubmit = handleSubmit(async (values) => {
    // Validate the canonical contract shape (amount in minor units).
    const minor = majorToMinor(values.amountMajor);
    const parsed = transferSchema.safeParse({
      toAccountNumber: values.toAccountNumber,
      amount: minor,
      note: values.note || undefined,
    } satisfies Partial<TransferInput> as TransferInput);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form and try again");
      return;
    }

    try {
      await transfer.mutateAsync({ input: parsed.data });
      toast.success(
        "Transfer successful",
        `${formatMoney(minor)} sent to ${resolve.data?.accountName ?? values.toAccountNumber}`,
      );
      router.push("/transactions");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
    }
  });

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Send money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="toAccountNumber">Recipient account number</Label>
            <Controller
              control={control}
              name="toAccountNumber"
              rules={{ pattern: { value: /^\d{10}$/, message: "Enter a 10-digit account number" } }}
              render={({ field }) => (
                <Input
                  id="toAccountNumber"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="1000000002"
                  error={Boolean(errors.toAccountNumber)}
                  {...field}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    field.onChange(digits);
                    setAccount(digits);
                  }}
                />
              )}
            />
            {/* Name enquiry result */}
            {account.length === 10 ? (
              <div className="flex items-center gap-2 text-sm">
                {resolve.isLoading ? (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin" /> Resolving…
                  </span>
                ) : resolve.data ? (
                  <span className="flex items-center gap-1.5 font-medium text-success">
                    <CheckCircle2 className="size-4" /> {resolve.data.accountName}
                  </span>
                ) : (
                  <span className="text-destructive">Account not found</span>
                )}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amountMajor">Amount (₦)</Label>
            <Input
              id="amountMajor"
              inputMode="decimal"
              placeholder="0.00"
              error={Boolean(errors.amountMajor)}
              {...register("amountMajor", {
                required: "Enter an amount",
                validate: (v) => Number(v) > 0 || "Amount must be greater than zero",
              })}
            />
            {amountMajor && Number(amountMajor) > 0 ? (
              <p className="text-xs text-muted-foreground">
                You are sending {formatMoney(majorToMinor(amountMajor))}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Input id="note" placeholder="What's it for?" maxLength={140} {...register("note")} />
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={transfer.isPending}
            disabled={account.length === 10 && !resolve.data}
          >
            {resolve.data ? `Send to ${resolve.data.accountName}` : "Send money"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
