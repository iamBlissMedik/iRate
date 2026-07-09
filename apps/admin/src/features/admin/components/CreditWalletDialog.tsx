"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { creditWalletSchema, type CreditWalletInput } from "@irate/contracts";
import { formatMoney, majorToMinor } from "@irate/contracts/money";
import { useCreditWallet } from "@irate/api-client/react";
import { ApiError, getErrorMessage } from "@irate/api-client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  toast,
} from "@irate/ui";

interface FormShape {
  amountMajor: string;
  reason: string;
}

/** Credit a wallet by id. Amount is entered in major units (₦) and converted. */
export function CreditWalletDialog({
  walletId,
  trigger,
  subjectLabel,
}: {
  walletId: string;
  trigger: ReactNode;
  subjectLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const credit = useCreditWallet();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormShape>({ defaultValues: { amountMajor: "", reason: "" } });

  const amountMajor = watch("amountMajor");

  const onSubmit = handleSubmit(async (values) => {
    const minor = majorToMinor(values.amountMajor);
    const parsed = creditWalletSchema.safeParse({
      amount: minor,
      reason: values.reason,
    } satisfies CreditWalletInput);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    try {
      await credit.mutateAsync({ walletId, input: parsed.data });
      toast.success("Wallet credited", `${formatMoney(minor)} added`);
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err instanceof ApiError ? err : "Credit failed"));
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Credit wallet</DialogTitle>
          <DialogDescription>
            {subjectLabel ? `Add funds to ${subjectLabel}.` : "Add funds to this wallet."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
                Crediting {formatMoney(majorToMinor(amountMajor))}
              </p>
            ) : null}
            {errors.amountMajor ? (
              <p className="text-xs text-destructive">{errors.amountMajor.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              placeholder="e.g. Manual top-up / reversal"
              error={Boolean(errors.reason)}
              {...register("reason", { required: "Reason is required" })}
            />
            {errors.reason ? (
              <p className="text-xs text-destructive">{errors.reason.message}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="submit" loading={credit.isPending}>
              Credit wallet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
