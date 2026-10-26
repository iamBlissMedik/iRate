"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, type LoginInput } from "@irate/contracts";
import { useLogin } from "@irate/api-client/react";
import { getErrorMessage, safeRedirectPath } from "@irate/api-client";
import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  toast,
} from "@irate/ui";

/** Why the user landed on /login (set by the route guard and the API client). */
const NOTICES: Record<string, string> = {
  expired: "Your session expired. Please sign in again.",
  forbidden: "That account doesn't have access to the admin console.",
};

/** Admin sign-in. The BFF refuses to create a session for non-ADMIN accounts. */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useLogin();
  const notice = NOTICES[params.get("error") ?? params.get("session") ?? ""];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) =>
    login.mutate(values, {
      onSuccess: () => router.replace(safeRedirectPath(params.get("from"), "/dashboard")),
      onError: (error) => toast.error(getErrorMessage(error, "Sign in failed")),
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup className="gap-5">
        {notice ? (
          <Alert>
            <AlertDescription>{notice}</AlertDescription>
          </Alert>
        ) : null}

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@irate.dev"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        <Button type="submit" className="w-full" loading={login.isPending}>
          Sign in
        </Button>
      </FieldGroup>
    </form>
  );
}
