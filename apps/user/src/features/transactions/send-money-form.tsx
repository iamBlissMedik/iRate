"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { AmountMajorInput, transferFormSchema, type TransferFormInput } from "@irate/contracts";
import { formatMoney, majorToMinor } from "@irate/contracts/money";
import { useResolveAccount, useTransfer } from "@irate/api-client/react";
import { getErrorMessage } from "@irate/api-client";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Spinner,
  toast,
} from "@irate/ui";

/** Transfer to another iRate account, with a live name enquiry on the recipient. */
export function SendMoneyForm() {
  const router = useRouter();
  const transfer = useTransfer();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransferFormInput>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: { toAccountNumber: "", amount: "", note: "" },
  });

  const accountNumber = useWatch({ control, name: "toAccountNumber" });
  const amount = useWatch({ control, name: "amount" });
  const recipient = useResolveAccount(accountNumber);
  const complete = accountNumber.length === 10;
  // `null` = the backend has no such account (see api.transaction.resolve).
  const notFound = complete && recipient.data === null;
  const preview = AmountMajorInput.safeParse(amount).success
    ? formatMoney(majorToMinor(amount))
    : null;

  const onSubmit = handleSubmit((values) => {
    const minor = majorToMinor(values.amount);
    transfer.mutate(
      {
        input: {
          toAccountNumber: values.toAccountNumber,
          amount: minor,
          note: values.note || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Transfer successful", {
            description: `${formatMoney(minor)} sent to ${recipient.data?.accountName ?? values.toAccountNumber}`,
          });
          router.push("/transactions");
        },
        onError: (error) => toast.error(getErrorMessage(error, "Transfer failed")),
      },
    );
  });

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Transfer details</CardTitle>
        <CardDescription>Transfers between iRate accounts arrive instantly.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup className="gap-5">
            <Field data-invalid={!!errors.toAccountNumber || notFound}>
              <FieldLabel htmlFor="toAccountNumber">Recipient account number</FieldLabel>
              <Controller
                control={control}
                name="toAccountNumber"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="toAccountNumber"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={10}
                    placeholder="1000000002"
                    aria-invalid={!!errors.toAccountNumber || notFound}
                    // Digits only — paste-friendly.
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                )}
              />
              {complete && recipient.isFetching ? (
                <FieldDescription className="flex items-center gap-1.5">
                  <Spinner className="size-3.5" /> Checking account…
                </FieldDescription>
              ) : complete && recipient.data ? (
                <FieldDescription className="flex items-center gap-1.5 font-medium text-success">
                  <CheckCircle2 className="size-4" /> {recipient.data.accountName}
                </FieldDescription>
              ) : null}
              <FieldError errors={[errors.toAccountNumber]}>
                {notFound ? "No iRate account has this number" : undefined}
              </FieldError>
            </Field>

            <Field data-invalid={!!errors.amount}>
              <FieldLabel htmlFor="amount">Amount (₦)</FieldLabel>
              <Input
                id="amount"
                inputMode="decimal"
                placeholder="0.00"
                aria-invalid={!!errors.amount}
                {...register("amount")}
              />
              {preview ? <FieldDescription>You are sending {preview}</FieldDescription> : null}
              <FieldError errors={[errors.amount]} />
            </Field>

            <Field data-invalid={!!errors.note}>
              <FieldLabel htmlFor="note">Note (optional)</FieldLabel>
              <Input
                id="note"
                placeholder="What's it for?"
                maxLength={140}
                aria-invalid={!!errors.note}
                {...register("note")}
              />
              <FieldError errors={[errors.note]} />
            </Field>

            <Button
              type="submit"
              className="w-full"
              loading={transfer.isPending}
              disabled={notFound || (complete && recipient.isFetching)}
            >
              {recipient.data ? `Send to ${recipient.data.accountName}` : "Send money"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
