"use client";

import { memo } from "react";
import { Button, Input, Label, Logo, ThemeToggle } from "@irate/ui";
import { useLoginForm } from "../hooks/useLoginForm";

/**
 * Admin login form. UI comes from the shared design system (@irate/ui); all
 * logic lives in useLoginForm (BFF login, ADMIN-gated).
 */
const LoginForm = () => {
  const { register, errors, isSubmitting, handleLogin } = useLoginForm();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>
          <p className="text-sm text-muted-foreground">Restricted to administrators.</p>
        </div>
        <form className="space-y-4" onSubmit={handleLogin} noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@irate.dev"
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
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default memo(LoginForm);
