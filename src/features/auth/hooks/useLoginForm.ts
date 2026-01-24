/**
 * useLoginForm Hook
 *
 * Handles login form state and submission logic
 * Follows Single Responsibility Principle - only manages form logic
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { signInSchema } from "@/lib/validators/authSchemas";
import { handleAxiosError } from "@/lib/errors/handleAxiosError";
import type { ILoginFormData } from "@/types/formTypes";

/**
 * Custom hook for login form management
 * Separates form logic from UI rendering (Single Responsibility)
 */
export const useLoginForm = () => {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") ?? "/dashboard";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ILoginFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  /**
   * Authenticates user using NextAuth
   * Follows Dependency Inversion - depends on signIn abstraction
   */
  const authenticateUser = async (credentials: ILoginFormData) => {
    const response = await signIn("credentials", {
      ...credentials,
      redirect: false,
      callbackUrl,
    });

    if (response?.error) {
      throw new Error(response.error);
    }

    return response;
  };

  /**
   * Handles successful authentication
   * Follows Single Responsibility - only handles success case
   */
  const handleSuccess = () => {
    toast.success("Login successful!");
    router.push(callbackUrl);
  };

  /**
   * Handles authentication errors
   * Follows Single Responsibility - only handles error case
   */
  const handleError = (error: unknown) => {
    console.error("Login failed:", error);

    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      handleAxiosError(error);
    }
  };

  /**
   * Main form submission handler
   * Orchestrates authentication flow
   */
  const onSubmit = async (data: ILoginFormData) => {
    try {
      const response = await authenticateUser(data);

      if (response?.ok) {
        handleSuccess();
      }
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * Returns form props and handlers
   * Clean interface for the component (Interface Segregation)
   */
  return {
    register,
    control,
    errors,
    isSubmitting,
    isValid,
    handleLogin: handleSubmit(onSubmit),
  };
};
