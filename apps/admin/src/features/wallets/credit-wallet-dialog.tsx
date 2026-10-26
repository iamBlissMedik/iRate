"use client";

import { useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  AmountMajorInput,
  creditWalletFormSchema,
  type CreditWalletFormInput,
} from "@irate/contracts";
import { formatMoney, majorToMinor } from "@irate/contracts/money";
import { useCreditWallet } from "@irate/api-client/react";
import { getErrorMessage } from "@irate/api-client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  toast,
} from "@irate/ui";

/** Manually credit a wallet. `trigger` opens the dialog; `subject` names the owner. */
export function CreditWalletDialog({
  walletId,
  subject,
  trigger,
}: {
  walletId: string;
  subject?: string;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Credit wallet</DialogTitle>
          <DialogDescription>
            {subject ? `Add funds to ${subject}'s wallet.` : "Add funds to this wallet."} Credits
            are recorded in the ledger with your reason.
          </DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so the form starts empty every time. */}
        <CreditWalletForm walletId={walletId} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CreditWalletForm({ walletId, onDone }: { walletId: string; onDone: () => void }) {
  const credit = useCreditWallet();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreditWalletFormInput>({
    resolver: zodResolver(creditWalletFormSchema),
    defaultValues: { amount: "", reason: "" },
  });

  const amount = useWatch({ control, name: "amount" });
  const preview = AmountMajorInput.safeParse(amount).success
    ? formatMoney(majorToMinor(amount))
    : null;

  const onSubmit = handleSubmit((values) => {
    const minor = majorToMinor(values.amount);
    credit.mutate(
      { walletId, input: { amount: minor, reason: values.reason } },
      {
        onSuccess: () => {
          toast.success("Wallet credited", { description: `${formatMoney(minor)} added` });
          onDone();
        },
        onError: (error) => toast.error(getErrorMessage(error, "Credit failed")),
      },
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup className="gap-5">
        <Field data-invalid={!!errors.amount}>
          <FieldLabel htmlFor="credit-amount">Amount (₦)</FieldLabel>
          <Input
            id="credit-amount"
            inputMode="decimal"
            placeholder="0.00"
            aria-invalid={!!errors.amount}
            {...register("amount")}
          />
          {preview ? <FieldDescription>Crediting {preview}</FieldDescription> : null}
          <FieldError errors={[errors.amount]} />
        </Field>

        <Field data-invalid={!!errors.reason}>
          <FieldLabel htmlFor="credit-reason">Reason</FieldLabel>
          <Input
            id="credit-reason"
            placeholder="e.g. Manual top-up, reversal"
            aria-invalid={!!errors.reason}
            {...register("reason")}
          />
          <FieldError errors={[errors.reason]} />
        </Field>

        <DialogFooter>
          <Button type="submit" loading={credit.isPending}>
            Credit wallet
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
