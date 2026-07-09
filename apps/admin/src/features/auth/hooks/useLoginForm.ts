/**
 * useLoginForm Hook
 *
 * Manages login form state and submission. Auth now goes through the BFF
 * (`/api/auth/login`, ADMIN-gated) — no NextAuth, no client-side tokens.
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@irate/api-client/react";
import { ApiError, getErrorMessage } from "@irate/api-client";
import { toast } from "@irate/ui";
import { signInSchema } from "@/lib/validators/authSchemas";
import type { ILoginFormData } from "@/types/formTypes";

export const useLoginForm = () => {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("from") ?? search.get("callbackUrl") ?? "/dashboard";
  const login = useLogin();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ILoginFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (data: ILoginFormData) => {
    try {
      await login.mutateAsync({ email: data.email, password: data.password });
      toast.success("Login successful");
      router.replace(callbackUrl);
      router.refresh();
    } catch (error) {
      // 403 = authenticated but not an ADMIN.
      const message =
        error instanceof ApiError && error.isForbidden
          ? "This account is not an admin."
          : getErrorMessage(error, "Login failed. Please try again.");
      toast.error(message);
    }
  };

  return {
    register,
    control,
    errors,
    isSubmitting: isSubmitting || login.isPending,
    isValid,
    handleLogin: handleSubmit(onSubmit),
  };
};
