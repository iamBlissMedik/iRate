"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { kycSubmitSchema, type KYCIdType, type KYCSubmitInput } from "@irate/contracts";
import { useSubmitKyc } from "@irate/api-client/react";
import { getErrorMessage } from "@irate/api-client";
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  NativeSelect,
  NativeSelectOption,
  toast,
} from "@irate/ui";

const ID_TYPES: Record<KYCIdType, string> = {
  NIN: "NIN",
  BVN: "BVN",
  PASSPORT: "International passport",
  DRIVERS_LICENSE: "Driver's license",
  VOTERS_CARD: "Voter's card",
};

/** Identity details for KYC review. */
export function KycForm() {
  const submit = useSubmitKyc();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KYCSubmitInput>({
    resolver: zodResolver(kycSubmitSchema),
    defaultValues: { fullName: "", dateOfBirth: "", address: "", idType: "NIN", idNumber: "" },
  });

  const onSubmit = handleSubmit((values) =>
    submit.mutate(values, {
      onSuccess: () =>
        toast.success("Details submitted", { description: "We'll review them shortly." }),
      onError: (error) => toast.error(getErrorMessage(error, "Could not submit your details")),
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup className="gap-5">
        <Field data-invalid={!!errors.fullName}>
          <FieldLabel htmlFor="fullName">Full legal name</FieldLabel>
          <Input
            id="fullName"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          <FieldError errors={[errors.fullName]} />
        </Field>

        <Field data-invalid={!!errors.dateOfBirth}>
          <FieldLabel htmlFor="dateOfBirth">Date of birth</FieldLabel>
          <Input
            id="dateOfBirth"
            type="date"
            autoComplete="bday"
            aria-invalid={!!errors.dateOfBirth}
            {...register("dateOfBirth")}
          />
          <FieldError errors={[errors.dateOfBirth]} />
        </Field>

        <Field data-invalid={!!errors.address}>
          <FieldLabel htmlFor="address">Residential address</FieldLabel>
          <Input
            id="address"
            autoComplete="street-address"
            aria-invalid={!!errors.address}
            {...register("address")}
          />
          <FieldError errors={[errors.address]} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={!!errors.idType}>
            <FieldLabel htmlFor="idType">ID type</FieldLabel>
            <NativeSelect id="idType" aria-invalid={!!errors.idType} {...register("idType")}>
              {Object.entries(ID_TYPES).map(([value, label]) => (
                <NativeSelectOption key={value} value={value}>
                  {label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError errors={[errors.idType]} />
          </Field>

          <Field data-invalid={!!errors.idNumber}>
            <FieldLabel htmlFor="idNumber">ID number</FieldLabel>
            <Input id="idNumber" aria-invalid={!!errors.idNumber} {...register("idNumber")} />
            <FieldError errors={[errors.idNumber]} />
          </Field>
        </div>

        <Button type="submit" className="w-full" loading={submit.isPending}>
          Submit for review
        </Button>
      </FieldGroup>
    </form>
  );
}
