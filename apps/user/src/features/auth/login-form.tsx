"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { loginSchema, type LoginInput } from "@irate/contracts";
import { useLogin } from "@irate/api-client/react";
import { ApiError } from "@irate/api-client";
import { Button, Input, Label, toast } from "@irate/ui";
import { FadeIn } from "@irate/ui/motion";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (params.get("session") === "expired") {
      toast.info("Your session expired", "Please sign in again to continue.");
    }
  }, [params]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
      toast.success("Welcome back");
      router.replace(params.get("from") ?? "/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.isValidation) {
        for (const [field, message] of Object.entries(err.toFieldRecord())) {
          setError(field as keyof LoginInput, { message });
        }
      } else if (err instanceof ApiError) {
        toast.error(err.message);
      }
    }
  });

  return (
    <FadeIn>
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting || login.isPending}>
          Sign in
        </Button>
      </form>
    </FadeIn>
  );
}
