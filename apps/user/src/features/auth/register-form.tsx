"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterInput } from "@irate/contracts";
import { useLogin, useRegister } from "@irate/api-client/react";
import { ApiError } from "@irate/api-client";
import { Button, Input, Label, toast } from "@irate/ui";
import { FadeIn } from "@irate/ui/motion";

export function RegisterForm() {
  const router = useRouter();
  const registerMut = useRegister();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await registerMut.mutateAsync({
        email: values.email,
        password: values.password,
      });
      // Seamless: log the user in right after registering.
      await login.mutateAsync({ email: values.email, password: values.password });
      toast.success(
        "Account created",
        result?.accountNumber ? `Your account number is ${result.accountNumber}` : undefined,
      );
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.isValidation) {
        for (const [field, message] of Object.entries(err.toFieldRecord())) {
          setError(field as keyof RegisterInput, { message });
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
          <Input id="email" type="email" autoComplete="email" error={!!errors.email} {...register("email")} />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" error={!!errors.password} {...register("password")} />
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          ) : null}
        </div>
        <Button type="submit" className="w-full" loading={registerMut.isPending || login.isPending}>
          Create account
        </Button>
      </form>
    </FadeIn>
  );
}
