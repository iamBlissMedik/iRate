"use client";

import { memo } from "react";
import { Button } from "@/shared/components/ui/button";
import { InputField, CheckboxField } from "@/shared/components/forms";
import { ThemeToggle } from "@/shared/components/layout";
import { useLoginForm } from "../hooks/useLoginForm";

/**
 * LoginForm Component (Optimized)
 *
 * Follows SOLID Principles:
 * - Single Responsibility: Only renders UI, delegates logic to useLoginForm
 * - Open/Closed: Extensible through props without modifying core
 * - Dependency Inversion: Depends on useLoginForm abstraction
 *
 * Optimizations:
 * - memo: Prevents unnecessary re-renders (no props, but good practice)
 * - Form fields are already optimized with controlled inputs
 */
const LoginForm = () => {
  const { register, errors, isSubmitting, isValid, control, handleLogin } =
    useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#26021e]">
      <div className="w-full max-w-md space-y-4 border text-center rounded pt-7 pb-14 px-9 bg-background">
        <ThemeToggle />
        <div className="flex justify-center"></div>
        <h1 className="text-2xl font-semibold text-foreground">Admin Login</h1>
        <form className="space-y-6" onSubmit={handleLogin}>
          <InputField
            id="email"
            label="Email"
            register={register}
            error={errors.email}
            placeholder="Enter your email"
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            register={register}
            error={errors.password}
            placeholder="Enter your password"
          />
          <CheckboxField id="remember" label="Remember me" control={control} />
          <Button
            type="submit"
            className="w-full rounded-xl  h-12 text-white bg-secondary-2"
            loading={isSubmitting}
            disabled={!isValid}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default memo(LoginForm);
